import {
	sorter,
	type SortContext,
	type SortOptions
} from "./_common.ts";
import type { ComparableType } from "./compare.ts";
export type { SortOptions } from "./_common.ts";
export type { ComparableType } from "./compare.ts";
export type SortElementsSelector<T> = (element: T) => ComparableType;
const sortElementsSelectorDefault: SortElementsSelector<unknown> = (element: unknown): ComparableType => {
	return element as ComparableType;
};
function sortElementsInternal<T>(elements: readonly T[], selector: SortElementsSelector<T>, options: SortOptions = {}): T[] {
	return sorter(elements.map((element: T): SortContext<T> => {
		return {
			original: element,
			select: selector(element)
		};
	}), options);
}
/**
 * Sort the elements.
 * @template {ComparableType} T
 * @param {readonly T[] | Iterable<T>} elements Elements that need to sort.
 * @param {SortOptions} [options={}] Options.
 * @returns {T[]} A sorted elements.
 */
export function sortElements<T extends ComparableType>(elements: readonly T[] | Iterable<T>, options?: SortOptions): T[];
/**
 * Sort the elements.
 * @template {ComparableType} T
 * @param {Set<T>} elements Elements that need to sort.
 * @param {SortOptions} [options={}] Options.
 * @returns {Set<T>} A sorted elements.
 */
export function sortElements<T extends ComparableType>(elements: Set<T>, options?: SortOptions): Set<T>;
/**
 * Sort the elements.
 * @template {unknown} T
 * @param {readonly T[] | Iterable<T>} elements Elements that need to sort.
 * @param {SortElementsSelector<T>} selector Selector to select sortable item.
 * @param {SortOptions} [options={}] Options.
 * @returns {T[]} A sorted elements.
 */
export function sortElements<T>(elements: readonly T[] | Iterable<T>, selector: SortElementsSelector<T>, options?: SortOptions): T[];
/**
 * Sort the elements.
 * @template {unknown} T
 * @param {Set<T>} elements Elements that need to sort.
 * @param {SortElementsSelector<T>} selector Selector to select sortable item.
 * @param {SortOptions} [options={}] Options.
 * @returns {Set<T>} A sorted elements.
 */
export function sortElements<T>(elements: Set<T>, selector: SortElementsSelector<T>, options?: SortOptions): Set<T>;
export function sortElements<T>(elements: readonly T[] | Iterable<T> | Set<T>, param1?: SortElementsSelector<T> | SortOptions, param2?: SortOptions): T[] | Set<T> {
	let options: SortOptions;
	let selector: SortElementsSelector<T>;
	switch (typeof param1) {
		case "function":
			options = param2 ?? {};
			selector = param1;
			break;
		case "undefined":
			options = {};
			selector = sortElementsSelectorDefault;
			break;
		default:
			options = param1 ?? {};
			selector = sortElementsSelectorDefault;
			break;
	}
	if (elements instanceof Set) {
		return new Set<T>(sortElementsInternal(Array.from(elements.values()), selector, options));
	}
	if (Array.isArray(elements)) {
		return sortElementsInternal(elements as readonly T[], selector, options);
	}
	return sortElementsInternal(Array.from(elements), selector, options);
}
