import {
	sort,
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
export interface SortElementsOptions<T> {
	/**
	 * Sort these special elements in this specify order.
	 */
	elementsSpecial?: readonly T[];
}
function partitionSpecialElements<T>(elements: readonly T[], elementsSpecial: readonly T[]): [specials: T[], rests: T[]] {
	const specials: T[] = [];
	const rests: T[] = [];
	for (const element of elements) {
		elementsSpecial.includes(element) ? specials.push(element) : rests.push(element);
	}
	specials.sort((a: T, b: T): number => {
		return (elementsSpecial.indexOf(a) - elementsSpecial.indexOf(b));
	});
	return [specials, rests];
}
function sortElementsInternal<T extends SortableType>(elements: readonly T[], options: SortOptions & SortElementsOptions<T>): T[] {
	const {
		elementsSpecial = [],
		restPlaceFirst = false
	}: SortOptions & SortElementsOptions<T> = options;
	const [
		specials,
		rests
	]: [specials: readonly T[], rests: readonly T[]] = partitionSpecialElements(elements, elementsSpecial);
	const restsSorted: readonly T[] = sort(rests, options);
	return (restPlaceFirst ? [...restsSorted, ...specials] : [...specials, ...restsSorted]);
}
/**
 * Sort the elements.
 * @template {SortableType} T
 * @param {readonly T[]} elements Elements that need to sort.
 * @param {SortOptions & SortElementsOptions<T>} [options={}] Options.
 * @returns {T[]} A sorted elements.
 */
export function sortElements<T extends SortableType>(elements: readonly T[], options?: SortOptions & SortElementsOptions<T>): T[];
/**
 * Sort the elements.
 * @template {SortableType} T
 * @param {Set<T>} elements Elements that need to sort.
 * @param {SortOptions & SortElementsOptions<T>} [options={}] Options.
 * @returns {Set<T>} A sorted elements.
 */
export function sortElements<T extends SortableType>(elements: Set<T>, options?: SortOptions & SortElementsOptions<T>): Set<T>;
export function sortElements<T extends SortableType>(elements: readonly T[] | Set<T>, options: SortOptions & SortElementsOptions<T> = {}): T[] | Set<T> {
	if (elements instanceof Set) {
		return new Set<T>(sortElementsInternal(Array.from(elements.values()), options));
	}
	return sortElementsInternal(elements, options);
}
function sortElementsBySelectorInternal<T>(elements: readonly T[], selector: SortElementsSelector<T>, options: SortOptions & SortElementsOptions<T>): T[] {
	const {
		elementsSpecial = [],
		restPlaceFirst = false
	}: SortOptions & SortElementsOptions<T> = options;
	const [
		specials,
		rests
	]: [specials: readonly T[], rests: readonly T[]] = partitionSpecialElements(elements, elementsSpecial);
	const restsSelector: readonly SortableType[] = sort(rests.map((element: T): SortableType => {
		return selector(element);
	}), options);
	const restsSorted: readonly T[] = [...rests].sort((a: T, b: T): number => {
		return (restsSelector.indexOf(selector(a)) - restsSelector.indexOf(selector(b)));
	});
	return (restPlaceFirst ? [...restsSorted, ...specials] : [...specials, ...restsSorted]);
}
/**
 * Sort the elements by selector.
 * @template {unknown} T
 * @param {readonly T[]} elements Elements that need to sort.
 * @param {SortElementsSelector<T>} selector Selector.
 * @param {SortOptions & SortElementsOptions<T>} [options={}] Options.
 * @returns {T[]} A sorted elements.
 */
export function sortElementsBySelector<T>(elements: readonly T[], selector: SortElementsSelector<T>, options?: SortOptions & SortElementsOptions<T>): T[];
/**
 * Sort the elements by selector.
 * @template {unknown} T
 * @param {Set<T>} elements Elements that need to sort.
 * @param {SortElementsSelector<T>} selector Selector.
 * @param {SortOptions & SortElementsOptions<T>} [options={}] Options.
 * @returns {Set<T>} A sorted elements.
 */
export function sortElementsBySelector<T>(elements: Set<T>, selector: SortElementsSelector<T>, options?: SortOptions & SortElementsOptions<T>): Set<T>;
export function sortElementsBySelector<T>(elements: readonly T[] | Set<T>, selector: SortElementsSelector<T>, options: SortOptions & SortElementsOptions<T> = {}): T[] | Set<T> {
	if (elements instanceof Set) {
		return new Set<T>(sortElementsBySelectorInternal(Array.from(elements.values()), selector, options));
	}
	return sortElementsBySelectorInternal(elements, selector, options);
}
