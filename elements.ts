import {
	sort,
	type PartitionResult,
	type SortableType,
	type SortElementsSelector,
	type SortOptions,
	type SortOrder
} from "./_common.ts";
export type {
	SortableType,
	SortElementsSelector,
	SortOptions,
	SortOrder
};
export interface SortElementsOptions<T> extends SortOptions {
	/**
	 * Pick these elements as special, sort these special elements in specify order (property {@linkcode specialOrder}) and place first unless the rest elements should place first (property {@linkcode restPlaceFirst}).
	 */
	specialElements?: readonly T[] | ((element: T) => boolean);
}
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
function sortElementsInternal<T>(elements: readonly T[], options: SortElementsOptions<T>, selector?: SortElementsSelector<T>): T[] {
	const {
		restOrder = "ascending",
		restPlaceFirst = false,
		smartNumeric = false,
		specialElements,
		specialOrder = "keep"
	}: SortElementsOptions<T> = options;
	const {
		rests,
		specials
	}: PartitionResult<readonly T[]> = partitionElements(elements, specialElements);
	const specialsSorted: readonly T[] = sort(specials, {
		order: specialOrder,
		selector,
		smartNumeric
	});
	const restsSorted: readonly T[] = sort(rests, {
		order: restOrder,
		selector,
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
export function sortElements<T extends SortableType>(elements: readonly T[] | Iterable<T> | Set<T>, options: SortElementsOptions<T> = {}): T[] | Set<T> {
	if (Array.isArray(elements)) {
		return sortElementsInternal(elements, options);
	}
	if (elements instanceof Set) {
		return new Set<T>(sortElementsInternal(Array.from(elements.values()), options));
	}
	return sortElementsInternal(Array.from(elements), options);
}
/**
 * Sort the elements by selector.
 * @template {unknown} T
 * @param {readonly T[] | Iterable<T>} elements Elements that need to sort.
 * @param {SortElementsSelector<T>} selector Selector.
 * @param {SortElementsOptions<T>} [options={}] Options.
 * @returns {T[]} A sorted elements.
 */
export function sortElementsBySelector<T>(elements: readonly T[] | Iterable<T>, selector: SortElementsSelector<T>, options?: SortElementsOptions<T>): T[];
/**
 * Sort the elements by selector.
 * @template {unknown} T
 * @param {Set<T>} elements Elements that need to sort.
 * @param {SortElementsSelector<T>} selector Selector.
 * @param {SortElementsOptions<T>} [options={}] Options.
 * @returns {Set<T>} A sorted elements.
 */
export function sortElementsBySelector<T>(elements: Set<T>, selector: SortElementsSelector<T>, options?: SortElementsOptions<T>): Set<T>;
export function sortElementsBySelector<T>(elements: readonly T[] | Iterable<T> | Set<T>, selector: SortElementsSelector<T>, options: SortElementsOptions<T> = {}): T[] | Set<T> {
	if (Array.isArray(elements)) {
		return sortElementsInternal(elements, options, selector);
	}
	if (elements instanceof Set) {
		return new Set<T>(sortElementsInternal(Array.from(elements.values()), options, selector));
	}
	return sortElementsInternal(Array.from(elements), options, selector);
}
