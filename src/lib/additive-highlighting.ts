const EDGE_SEPARATOR_REGEX = /^[\s,;.:•\-*]+|[\s,;.:•\-*]+$/g;
const ALNUM_CHAR_REGEX = /[\p{L}\p{N}]/u;

const FOLD_CHAR_MAP: Record<string, string> = {
	ă: "a",
	Ă: "A",
	â: "a",
	Â: "A",
	î: "i",
	Î: "I",
	ș: "s",
	Ș: "S",
	ş: "s",
	Ş: "S",
	ț: "t",
	Ț: "T",
	ţ: "t",
	Ţ: "T",
	á: "a",
	Á: "A",
	à: "a",
	À: "A",
	ä: "a",
	Ä: "A",
	é: "e",
	É: "E",
	è: "e",
	È: "E",
	ë: "e",
	Ë: "E",
	í: "i",
	Í: "I",
	ó: "o",
	Ó: "O",
	ö: "o",
	Ö: "O",
	ú: "u",
	Ú: "U",
	ü: "u",
	Ü: "U",
};

function foldDiacritics1To1(input: string): string {
	let out = "";
	for (let i = 0; i < input.length; i++) {
		const ch = input[i];
		out += FOLD_CHAR_MAP[ch] ?? ch;
	}
	return out;
}

function escapeRegex(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasWordBoundaries(
	text: string,
	start: number,
	end: number,
	phrase: string,
): boolean {
	if (phrase.length === 0) return false;
	const firstChar = phrase[0];
	const lastChar = phrase[phrase.length - 1];

	if (ALNUM_CHAR_REGEX.test(firstChar) && start > 0) {
		if (ALNUM_CHAR_REGEX.test(text[start - 1])) {
			return false;
		}
	}
	if (ALNUM_CHAR_REGEX.test(lastChar) && end < text.length) {
		if (ALNUM_CHAR_REGEX.test(text[end])) {
			return false;
		}
	}
	return true;
}

function findBoundarySafeMatches(
	text: string,
	phrase: string,
): Array<{ start: number; end: number }> {
	if (!text || !phrase) return [];
	const escaped = escapeRegex(phrase);
	const regex = new RegExp(escaped, "giu");
	const matches: Array<{ start: number; end: number }> = [];

	let match = regex.exec(text);
	while (match !== null) {
		const start = match.index;
		const end = start + match[0].length;
		if (hasWordBoundaries(text, start, end, match[0])) {
			matches.push({ start, end });
		} else {
			regex.lastIndex = start + 1;
		}
		if (match[0].length === 0) {
			regex.lastIndex++;
		}
		match = regex.exec(text);
	}

	return matches;
}

function phraseContainsOther(outer: string, inner: string): boolean {
	return findBoundarySafeMatches(outer, inner).length > 0;
}

export function normalizeAdditivePhrase(raw: string): string {
	let s = raw.trim().replace(EDGE_SEPARATOR_REGEX, "");

	let changed = true;
	while (changed && s.length > 0) {
		changed = false;
		let depth = 0;
		let unmatchedTrailingClose = false;

		for (let i = 0; i < s.length; i++) {
			if (s[i] === "(") {
				depth++;
			} else if (s[i] === ")") {
				if (depth === 0) {
					if (i === s.length - 1) {
						unmatchedTrailingClose = true;
					}
				} else {
					depth--;
				}
			}
		}

		if (unmatchedTrailingClose && s.endsWith(")")) {
			s = s.slice(0, -1).replace(EDGE_SEPARATOR_REGEX, "");
			changed = true;
			continue;
		}

		if (depth > 0 && s.startsWith("(")) {
			s = s.slice(1).replace(EDGE_SEPARATOR_REGEX, "");
			changed = true;
		}
	}

	return s;
}

export function sanitizeHighlightedAdditives(
	list: string[] | null | undefined,
): string[] | null {
	if (list == null) return null;

	const seen = new Set<string>();
	const result: string[] = [];

	for (const raw of list) {
		if (typeof raw !== "string") continue;
		const normalized = normalizeAdditivePhrase(raw);
		if (!normalized) continue;
		const key = normalized.toLocaleLowerCase("ro");
		if (seen.has(key)) continue;
		seen.add(key);
		result.push(normalized);
	}

	return result;
}

export function mergeAdditivePhrase(
	existing: string[],
	candidate: string,
): string[] {
	const normalized = normalizeAdditivePhrase(candidate);
	if (!normalized) return existing;

	const normalizedKey = normalized.toLocaleLowerCase("ro");

	for (const item of existing) {
		const itemKey = item.toLocaleLowerCase("ro");
		if (itemKey === normalizedKey || phraseContainsOther(item, normalized)) {
			return existing;
		}
	}

	const filtered = existing.filter(
		(item) => !phraseContainsOther(normalized, item),
	);
	return [...filtered, normalized];
}

export type HighlightSegment = {
	text: string;
	highlighted: boolean;
};

export function splitTextWithHighlights(
	text: string,
	phrases: string[],
): HighlightSegment[] {
	if (!text || !phrases.length) {
		return [{ text, highlighted: false }];
	}

	const cleanedPhrases = (sanitizeHighlightedAdditives(phrases) ?? []).sort(
		(a, b) => b.length - a.length,
	);

	if (cleanedPhrases.length === 0) {
		return [{ text, highlighted: false }];
	}

	const intervals: Array<{ start: number; end: number }> = [];
	for (const phrase of cleanedPhrases) {
		const matches = findBoundarySafeMatches(text, phrase);
		for (const m of matches) {
			intervals.push(m);
		}
	}

	if (intervals.length === 0) {
		return [{ text, highlighted: false }];
	}

	intervals.sort((a, b) => a.start - b.start || b.end - a.end);

	const merged: Array<{ start: number; end: number }> = [];
	for (const interval of intervals) {
		const last = merged[merged.length - 1];
		if (!last || interval.start >= last.end) {
			merged.push({ ...interval });
		} else if (interval.end > last.end) {
			last.end = interval.end;
		}
	}

	const segments: HighlightSegment[] = [];
	let cursor = 0;

	for (const { start, end } of merged) {
		if (start > cursor) {
			segments.push({
				text: text.slice(cursor, start),
				highlighted: false,
			});
		}
		segments.push({
			text: text.slice(start, end),
			highlighted: true,
		});
		cursor = end;
	}

	if (cursor < text.length) {
		segments.push({
			text: text.slice(cursor),
			highlighted: false,
		});
	}

	return segments;
}

export function isPhraseFoundInText(text: string, phrase: string): boolean {
	if (!text || !phrase) return false;
	return splitTextWithHighlights(text, [phrase]).some((s) => s.highlighted);
}

export function suggestScoreFromAdditivesCount(
	count: number,
): "gold" | "silver" | "bronze" {
	if (count <= 0) return "gold";
	if (count <= 2) return "silver";
	return "bronze";
}

const FUNCTIONAL_CLASS_PATTERNS = [
	"corector(?:i)?\\s+de\\s+aciditate",
	"acidifiant(?:i)?",
	"emulsifiant(?:i)?",
	"emulgator(?:i)?",
	"conservant(?:i)?",
	"antioxidant(?:i)?",
	"stabilizator(?:i)?",
	"agent(?:i)?\\s+de\\s+(?:glazurare|ingrosare|afanare|gelifiere|tratare\\s+a\\s+fainii|umedare|sechestrare|spumare|antispumare|incarcare|intarire|coacere)",
	"antiaglomerant(?:i)?",
	"indulcitor(?:i)?",
	"potentiator(?:i)?\\s+de\\s+aroma",
	"corector(?:i)?\\s+de\\s+gust",
	"gaz(?:e)?\\s+de\\s+(?:ambalare|propulsare)",
	"colorant(?:i)?",
];

const FUNCTIONAL_CLASS_REGEX = new RegExp(
	`(${FUNCTIONAL_CLASS_PATTERNS.join("|")})`,
	"giu",
);

const COLORANT_CLEAN_FOLLOW_REGEX =
	/^(?:alimentari?\s+)?(?:naturali?\s+)?din\s+(?:fructe|plante|legume|extracte)/i;

const NEGATED_PREFIX_REGEX =
	/(?:fara|nu\s+contine|nu\s+contin)\s+(?:adaos\s+de\s+)?$/i;

const E_CODE_REGEX =
	/\bE([\s-]?)(1[0-5]\d{2}|[1-9]\d{2})(?:[a-z](?:i{1,3}|iv)?|(?:i{1,3}|iv))?\b/gi;

const STANDALONE_ROMANIAN_ADDITIVES = [
	"mono- si digliceride ale acizilor grasi",
	"mono si digliceride ale acizilor grasi",
	"glicozide derivate din steviol",
	"poliglicerol poliricinoleat",
	"hidroxipropilmetilceluloza",
	"extract bogat in tocoferoli",
	"extract bogat in tocoferol",
	"guma de seminte de carruba",
	"lecitina din floarea-soarelui",
	"lecitina de floarea-soarelui",
	"celuloza microcristalina",
	"carboximetilceluloza",
	"caramel sulfit de amoniu",
	"carbonat acid de sodiu",
	"monoglutamat de sodiu",
	"palmitat de ascorbil",
	"bicarbonat de amoniu",
	"bicarbonat de sodiu",
	"metabisulfit de sodiu",
	"citrat de potasiu",
	"carbonat de amoniu",
	"caramel amoniacal",
	"citrat de calciu",
	"citrat de sodiu",
	"citrati de sodiu",
	"carbonat de sodiu",
	"ceara de carnauba",
	"sorbat de potasiu",
	"lecitina din soia",
	"lecitina de rapita",
	"lecitina de soia",
	"glutamat monosodic",
	"benzoat de sodiu",
	"dioxid de siliciu",
	"nitrat de potasiu",
	"nitrit de sodiu",
	"nitrat de sodiu",
	"dioxid de titan",
	"fosfat de sodiu",
	"inosinat disodic",
	"guanilat disodic",
	"dioxid de sulf",
	"ceara de albine",
	"acid ascorbic",
	"acid fosforic",
	"guma de carruba",
	"acid benzoic",
	"guma arabica",
	"acid tartric",
	"acid lactic",
	"acid sorbic",
	"acid citric",
	"guma xantan",
	"guma gellan",
	"beta-caroten",
	"beta caroten",
	"acid malic",
	"guma de guar",
	"acesulfam-k",
	"acesulfam k",
	"polifosfati",
	"guma guar",
	"guma tara",
	"riboflavina",
	"clorofiline",
	"carragenan",
	"sucraloza",
	"ciclamat",
	"aspartam",
	"eritritol",
	"trifosfati",
	"difosfati",
	"curcumina",
	"caragenan",
	"zaharina",
	"maltitol",
	"sorbitol",
	"xilitol",
	"pectine",
	"pectina",
	"carmin",
].sort((a, b) => b.length - a.length);

function overlapsAny(
	intervals: Array<{ start: number; end: number }>,
	start: number,
	end: number,
): boolean {
	return intervals.some((item) => start < item.end && end > item.start);
}

function isDecimalDot(text: string, index: number): boolean {
	return (
		index > 0 &&
		index + 1 < text.length &&
		/\d/.test(text[index - 1]) &&
		/\d/.test(text[index + 1])
	);
}

function scanFunctionalPayloadEnd(text: string, startIndex: number): number {
	let i = startIndex;
	let parenDepth = 0;

	while (i < text.length) {
		const ch = text[i];

		if (ch === "(") {
			parenDepth++;
			i++;
			continue;
		}

		if (ch === ")") {
			if (parenDepth === 0) {
				break;
			}
			parenDepth--;
			i++;
			if (parenDepth === 0) {
				// Stop once the functional class's balanced parenthetical payload closes
				// unless there is a trailing E-code paren like `acid citric (E330)` -
				// in that case keep scanning only if followed by another separator/text?
				// Usually `corectori de aciditate (acid citric, citrat)` or `agenti (ceara)` ends right here.
				let lookahead = i;
				while (lookahead < text.length && text[lookahead] === " ") {
					lookahead++;
				}
				if (
					lookahead >= text.length ||
					text[lookahead] === "," ||
					text[lookahead] === ";" ||
					text[lookahead] === "." ||
					text[lookahead] === ")" ||
					text[lookahead] === "\n"
				) {
					break;
				}
			}
			continue;
		}

		if (parenDepth === 0) {
			if (ch === "," || ch === ";" || ch === "\n") {
				break;
			}
			if (ch === "." && !isDecimalDot(text, i)) {
				break;
			}
		}

		i++;
	}

	return i;
}

function expandECodeInterval(
	text: string,
	folded: string,
	matchStart: number,
	matchEnd: number,
): { start: number; end: number } {
	let spanStart = matchStart;
	let spanEnd = matchEnd;

	// If the E-code itself is directly parenthesized like `(E300)`, treat `(E300)` as the anchor
	if (
		spanStart > 0 &&
		spanEnd < text.length &&
		text[spanStart - 1] === "(" &&
		text[spanEnd] === ")"
	) {
		spanStart -= 1;
		spanEnd += 1;
	}

	let left = spanStart;
	let rightCloseBalance = 0;
	while (left > 0) {
		const ch = text[left - 1];
		if (ch === "," || ch === ";" || ch === "\n") {
			break;
		}
		if (ch === "." && !isDecimalDot(text, left - 1)) {
			break;
		}
		if (ch === ")") {
			rightCloseBalance++;
			left--;
			continue;
		}
		if (ch === "(") {
			if (rightCloseBalance === 0) {
				break;
			}
			rightCloseBalance--;
			left--;
			continue;
		}
		if (ch === ":") {
			const prefix = folded.slice(Math.max(0, left - 24), left - 1);
			if (/(?:ingrediente|contine)\s*$/i.test(prefix)) {
				break;
			}
		}
		left--;
	}

	let right = spanEnd;
	let parenDepth = 0;
	while (right < text.length) {
		const ch = text[right];
		if (ch === "(") {
			parenDepth++;
			right++;
			continue;
		}
		if (ch === ")") {
			if (parenDepth === 0) {
				break;
			}
			parenDepth--;
			right++;
			continue;
		}
		if (parenDepth === 0) {
			if (ch === "," || ch === ";" || ch === "\n") {
				break;
			}
			if (ch === "." && !isDecimalDot(text, right)) {
				break;
			}
		}
		right++;
	}

	while (left < right && /\s/.test(text[left])) left++;
	while (right > left && /\s/.test(text[right - 1])) right--;

	return { start: left, end: right };
}

export function detectAdditiveCandidates(text: string): string[] {
	if (!text.trim()) return [];

	const folded = foldDiacritics1To1(text);
	const intervals: Array<{ start: number; end: number }> = [];

	// 1. EU functional classes in Romanian
	FUNCTIONAL_CLASS_REGEX.lastIndex = 0;
	let classMatch = FUNCTIONAL_CLASS_REGEX.exec(folded);
	while (classMatch !== null) {
		const start = classMatch.index;
		const classEnd = start + classMatch[0].length;

		if (!hasWordBoundaries(folded, start, classEnd, classMatch[0])) {
			FUNCTIONAL_CLASS_REGEX.lastIndex = start + 1;
			classMatch = FUNCTIONAL_CLASS_REGEX.exec(folded);
			continue;
		}

		const preceding = folded.slice(Math.max(0, start - 32), start);
		if (NEGATED_PREFIX_REGEX.test(preceding)) {
			classMatch = FUNCTIONAL_CLASS_REGEX.exec(folded);
			continue;
		}

		let afterClass = classEnd;
		while (
			afterClass < folded.length &&
			(folded[afterClass] === " " || folded[afterClass] === ":")
		) {
			afterClass++;
		}

		const classLower = classMatch[0].toLowerCase();
		if (classLower.startsWith("colorant")) {
			const tail = folded.slice(afterClass, afterClass + 64);
			if (COLORANT_CLEAN_FOLLOW_REGEX.test(tail)) {
				classMatch = FUNCTIONAL_CLASS_REGEX.exec(folded);
				continue;
			}
		}

		const payloadEnd = scanFunctionalPayloadEnd(text, afterClass);
		let end = payloadEnd;
		while (end > start && /[\s,;.:•\-*]/.test(text[end - 1])) {
			end--;
		}

		if (end > start && !overlapsAny(intervals, start, end)) {
			intervals.push({ start, end });
		}

		FUNCTIONAL_CLASS_REGEX.lastIndex = Math.max(end, classEnd);
		classMatch = FUNCTIONAL_CLASS_REGEX.exec(folded);
	}

	// 2. E-codes not already inside a functional class span
	E_CODE_REGEX.lastIndex = 0;
	let eMatch = E_CODE_REGEX.exec(folded);
	while (eMatch !== null) {
		const eStart = eMatch.index;
		const eEnd = eStart + eMatch[0].length;
		const separator = eMatch[1];

		if (separator) {
			const prev = folded.slice(Math.max(0, eStart - 16), eStart);
			const next = folded.slice(eEnd, eEnd + 8);
			if (
				/\bvitamina\s+$/i.test(prev) ||
				/^\s*(?:%|mg\b|ml\b|g\b|kg\b|l\b|kcal\b)/i.test(next)
			) {
				eMatch = E_CODE_REGEX.exec(folded);
				continue;
			}
		}

		if (!overlapsAny(intervals, eStart, eEnd)) {
			const expanded = expandECodeInterval(text, folded, eStart, eEnd);
			if (
				expanded.end > expanded.start &&
				!overlapsAny(intervals, expanded.start, expanded.end)
			) {
				intervals.push(expanded);
			} else if (!overlapsAny(intervals, eStart, eEnd)) {
				intervals.push({ start: eStart, end: eEnd });
			}
		}

		eMatch = E_CODE_REGEX.exec(folded);
	}

	// 3. Common standalone Romanian additive names
	for (const additive of STANDALONE_ROMANIAN_ADDITIVES) {
		const matches = findBoundarySafeMatches(folded, additive);
		for (const m of matches) {
			const preceding = folded.slice(Math.max(0, m.start - 32), m.start);
			if (NEGATED_PREFIX_REGEX.test(preceding)) continue;
			if (!overlapsAny(intervals, m.start, m.end)) {
				intervals.push(m);
			}
		}
	}

	intervals.sort((a, b) => a.start - b.start);

	const phrases = intervals.map(({ start, end }) => text.slice(start, end));
	return sanitizeHighlightedAdditives(phrases) ?? [];
}
