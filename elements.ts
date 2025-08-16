import {
	sorter,
	type PartitionResult,
	type SortableType,
	type SorterContext,
	type SortOptions
} from "./_common.ts";
export type {
	SortableType,
	SortOptions,
	SortOrder
} from "./_common.ts";
export interface SortElementsOptions<T> extends SortOptions {
	/**
	 * Select elements as special elements.
	 * @default {[]}
	 */
	specialElements?: readonly T[] | ((element: T) => boolean);
}
export type SortElementsSelector<T> = (element: T) => SortableType;
const sortElementsSelectorDefault: SortElementsSelector<unknown> = (element: unknown): SortableType => {
	return element as SortableType;
};
function partitionElements<T>(elements: readonly T[], specialElements: readonly T[] | ((element: T) => boolean) | undefined = []): PartitionResult<readonly T[]> {
	const rests: T[] = [];
	const specials: T[] = [];
	if (typeof specialElements === "function") {
		for (const element of elements) {
			specialElements(element) ? specials.push(element) : rests.push(element);
		}
	} else {
		for (const element of elements) {
			specialElements.includes(element) ? specials.push(element) : rests.push(element);
		}
		specials.sort((a: T, b: T): number => {
			return (specialElements.indexOf(a) - specialElements.indexOf(b));
		});
	}
	return {
		rests,
		specials
	};
}
function sortElementsInternal<T>(elements: readonly T[], selector: SortElementsSelector<T>, options: SortElementsOptions<T>): T[] {
	const {
		restOrder = "ascending",
		restPlaceFirst = false,
		smartNumeric = true,
		specialElements,
		specialOrder = "keep"
	}: SortElementsOptions<T> = options;
	const {
		rests,
		specials
	}: PartitionResult<readonly T[]> = partitionElements(elements, specialElements);
	const specialsSorted: readonly T[] = sorter(specials.map((special: T): SorterContext<T> => {
		return {
			original: special,
			select: selector(special)
		};
	}), {
		order: specialOrder,
		smartNumeric
	});
	const restsSorted: readonly T[] = sorter(rests.map((rest: T): SorterContext<T> => {
		return {
			original: rest,
			select: selector(rest)
		};
	}), {
		order: restOrder,
		smartNumeric
	});
	return (restPlaceFirst ? [...restsSorted, ...specialsSorted] : [...specialsSorted, ...restsSorted]);
}
/**
 * Sort the elements.
 * @template {SortableType} T
 * @param {readonly T[] | Iterable<T>} elements Elements that need to sort.
 * @param {SortElementsOptions<T>} [options={}] Options.
 * @returns {T[]} A sorted elements.
 */
export function sortElements<T extends SortableType>(elements: readonly T[] | Iterable<T>, options?: SortElementsOptions<T>): T[];
/**
 * Sort the elements.
 * @template {SortableType} T
 * @param {Set<T>} elements Elements that need to sort.
 * @param {SortElementsOptions<T>} [options={}] Options.
 * @returns {Set<T>} A sorted elements.
 */
export function sortElements<T extends SortableType>(elements: Set<T>, options?: SortElementsOptions<T>): Set<T>;
/**
 * Sort the elements.
 * @template {unknown} T
 * @param {readonly T[] | Iterable<T>} elements Elements that need to sort.
 * @param {SortElementsSelector<T>} selector Selector to select sortable item.
 * @param {SortElementsOptions<T>} [options={}] Options.
 * @returns {T[]} A sorted elements.
 */
export function sortElements<T>(elements: readonly T[] | Iterable<T>, selector: SortElementsSelector<T>, options?: SortElementsOptions<T>): T[];
/**
 * Sort the elements.
 * @template {unknown} T
 * @param {Set<T>} elements Elements that need to sort.
 * @param {SortElementsSelector<T>} selector Selector to select sortable item.
 * @param {SortElementsOptions<T>} [options={}] Options.
 * @returns {Set<T>} A sorted elements.
 */
export function sortElements<T>(elements: Set<T>, selector: SortElementsSelector<T>, options?: SortElementsOptions<T>): Set<T>;
export function sortElements<T>(elements: readonly T[] | Iterable<T> | Set<T>, param1?: SortElementsSelector<T> | SortElementsOptions<T>, param2?: SortElementsOptions<T>): T[] | Set<T> {
	let options: SortElementsOptions<T>;
	let selector: SortElementsSelector<T>;
	if (typeof param1 === "undefined") {
		options = {};
		selector = sortElementsSelectorDefault;
	} else if (typeof param1 === "function") {
		options = param2 ?? {};
		selector = param1;
	} else {
		options = param1 ?? {};
		selector = sortElementsSelectorDefault;
	}
	if (Array.isArray(elements)) {
		return sortElementsInternal(elements as readonly T[], selector, options);
	}
	if (elements instanceof Set) {
		return new Set<T>(sortElementsInternal(Array.from(elements.values()), selector, options));
	}
	return sortElementsInternal(Array.from(elements), selector, options);
}
