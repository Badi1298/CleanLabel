"use client";

import useEmblaCarousel, {
	type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
	type ComponentProps,
	createContext,
	type KeyboardEvent,
	useContext,
	useEffect,
	useState,
} from "react";
import { Button } from "#/components/ui/button";
import { cn } from "#/lib/utils";

type CarouselApi = UseEmblaCarouselType[1];
type CarouselHookParams = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = CarouselHookParams[0];
type CarouselPlugins = CarouselHookParams[1];

interface CarouselConfig {
	opts?: CarouselOptions;
	plugins?: CarouselPlugins;
	orientation?: "horizontal" | "vertical";
	setApi?: (api: CarouselApi) => void;
}

interface CarouselState extends CarouselConfig {
	viewportRef: ReturnType<typeof useEmblaCarousel>[0];
	emblaApi: CarouselApi;
	scrollPrev: () => void;
	scrollNext: () => void;
	canScrollPrev: boolean;
	canScrollNext: boolean;
}

const CarouselCtx = createContext<CarouselState | null>(null);

function useCarousel(): CarouselState {
	const value = useContext(CarouselCtx);
	if (!value) {
		throw new Error("useCarousel must be rendered inside <Carousel />.");
	}
	return value;
}

function Carousel({
	orientation = "horizontal",
	opts,
	plugins,
	setApi,
	className,
	children,
	"aria-label": ariaLabel,
	"aria-labelledby": ariaLabelledBy,
	...rest
}: ComponentProps<"section"> & CarouselConfig) {
	const resolvedAxis =
		orientation === "vertical" || opts?.axis === "y" ? "y" : "x";
	const resolvedOrientation = resolvedAxis === "y" ? "vertical" : "horizontal";

	const [viewportRef, emblaApi] = useEmblaCarousel(
		{ ...opts, axis: resolvedAxis },
		plugins,
	);
	const [canScrollPrev, setCanScrollPrev] = useState(false);
	const [canScrollNext, setCanScrollNext] = useState(false);

	useEffect(() => {
		if (!emblaApi || !setApi) return;
		setApi(emblaApi);
	}, [emblaApi, setApi]);

	useEffect(() => {
		if (!emblaApi) return;

		const syncNavigationState = (instance: NonNullable<CarouselApi>) => {
			setCanScrollPrev(instance.canScrollPrev());
			setCanScrollNext(instance.canScrollNext());
		};

		syncNavigationState(emblaApi);
		emblaApi.on("select", syncNavigationState);
		emblaApi.on("reInit", syncNavigationState);

		return () => {
			emblaApi.off("select", syncNavigationState);
			emblaApi.off("reInit", syncNavigationState);
		};
	}, [emblaApi]);

	const scrollPrev = () => {
		emblaApi?.scrollPrev();
	};

	const scrollNext = () => {
		emblaApi?.scrollNext();
	};

	const onArrowKeyDown = (event: KeyboardEvent<HTMLElement>) => {
		if (event.key === "ArrowLeft") {
			event.preventDefault();
			scrollPrev();
		} else if (event.key === "ArrowRight") {
			event.preventDefault();
			scrollNext();
		}
	};

	return (
		<CarouselCtx.Provider
			value={{
				viewportRef,
				emblaApi,
				opts,
				plugins,
				orientation: resolvedOrientation,
				scrollPrev,
				scrollNext,
				canScrollPrev,
				canScrollNext,
			}}
		>
			<section
				aria-roledescription="carousel"
				aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : "Carousel")}
				aria-labelledby={ariaLabelledBy}
				data-slot="carousel"
				onKeyDownCapture={onArrowKeyDown}
				className={cn("relative", className)}
				{...rest}
			>
				{children}
			</section>
		</CarouselCtx.Provider>
	);
}

function CarouselContent({
	className,
	viewportClassName,
	...rest
}: ComponentProps<"div"> & {
	viewportClassName?: string;
}) {
	const { viewportRef, orientation } = useCarousel();
	const isHorizontal = orientation === "horizontal";

	return (
		<div
			ref={viewportRef}
			data-slot="carousel-content"
			className={cn("relative overflow-hidden", viewportClassName)}
		>
			<div
				className={cn(
					"flex",
					isHorizontal ? "-ml-4" : "-mt-4 flex-col",
					className,
				)}
				{...rest}
			/>
		</div>
	);
}

function CarouselItem({ className, ...rest }: ComponentProps<"div">) {
	const { orientation } = useCarousel();
	const isHorizontal = orientation === "horizontal";

	return (
		// biome-ignore lint/a11y/useSemanticElements: WAI-ARIA carousel slides use role="group" with aria-roledescription="slide"
		<div
			role="group"
			aria-roledescription="slide"
			data-slot="carousel-item"
			className={cn(
				"min-w-0 shrink-0 grow-0 basis-full",
				isHorizontal ? "pl-4" : "pt-4",
				className,
			)}
			{...rest}
		/>
	);
}

function CarouselPrevious({
	className,
	variant = "outline",
	size = "icon",
	...rest
}: ComponentProps<typeof Button>) {
	const { orientation, scrollPrev, canScrollPrev } = useCarousel();
	const isHorizontal = orientation === "horizontal";

	return (
		<Button
			type="button"
			data-slot="carousel-previous"
			variant={variant}
			size={size}
			disabled={!canScrollPrev}
			onClick={scrollPrev}
			className={cn(
				"absolute size-8 rounded-full",
				isHorizontal
					? "top-1/2 -left-12 -translate-y-1/2"
					: "-top-12 left-1/2 -translate-x-1/2 rotate-90",
				className,
			)}
			{...rest}
		>
			<ArrowLeft aria-hidden="true" />
			<span className="sr-only">Previous slide</span>
		</Button>
	);
}

function CarouselNext({
	className,
	variant = "outline",
	size = "icon",
	...rest
}: ComponentProps<typeof Button>) {
	const { orientation, scrollNext, canScrollNext } = useCarousel();
	const isHorizontal = orientation === "horizontal";

	return (
		<Button
			type="button"
			data-slot="carousel-next"
			variant={variant}
			size={size}
			disabled={!canScrollNext}
			onClick={scrollNext}
			className={cn(
				"absolute size-8 rounded-full",
				isHorizontal
					? "top-1/2 -right-12 -translate-y-1/2"
					: "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
				className,
			)}
			{...rest}
		>
			<ArrowRight aria-hidden="true" />
			<span className="sr-only">Next slide</span>
		</Button>
	);
}

export {
	type CarouselApi,
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselPrevious,
	CarouselNext,
	useCarousel,
};
