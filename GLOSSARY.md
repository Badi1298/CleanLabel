# PickItWell

PickItWell is a food product transparency application that classifies packaged groceries strictly by the number of food additives declared on their label and shows which retail stores carry them.

## Language

**Score Tier**:
The product classification based strictly on declared additive count: `Gold` (0 additives), `Silver` (1–2 additives), and `Bronze` (3–4 additives), while products with 5 or more additives are excluded from the catalog. The tier names `Gold`, `Silver`, and `Bronze` are canonical and remain untranslated across locales.
_Avoid_: Rating, health score, grade, Aur, Argint, Bronz

**Additive**:
Any ingredient declared on a product label via an E-code (such as E330) or an equivalent functional additive name; every declared additive counts equally as one unit.
_Avoid_: Bad ingredient, chemical, preservative (when referring to all additives)

**Excluded Ingredient**:
An ingredient or additive that a user adds to their personal profile list so matching products are flagged while browsing.
_Avoid_: Blacklisted ingredient, allergen filter

**Catalog Data**:
Dynamic product, brand, category, store, and ingredient records curated in the database as entered (single-language for now).
_Avoid_: Static copy, translations

**Interface Copy**:
Static UI labels, navigation, onboarding, marketing, and legal text localized across supported locales.
_Avoid_: Product content, catalog text

**Locale**:
The user's active display language (`ro` or `en`), defaulting to Romanian (`ro`).
_Avoid_: Region, country

**Registered User**:
A `client` account created in PickItWell, excluding internal `admin` accounts.
_Avoid_: User (when ambiguous), visitor, account

**Active User**:
A Registered User who opens the authenticated application at least once within a given period — daily (`DAU`), rolling 7-day (`WAU`), or rolling 30-day (`MAU`) — measured on the `Europe/Bucharest` calendar day.
_Avoid_: Visitor, session, traffic

**App Install**:
A Registered User who has installed PickItWell as a standalone Progressive Web App, counted once per user with platform classification (`ios`, `android`, or `desktop`).
_Avoid_: Download, installation event, device install
