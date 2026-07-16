import {
	sorter,
	type SortContext,
	type SortOptions
} from "./_common.ts";
import type { ComparableType } from "./compare.ts";
export type { SortOptions } from "./_common.ts";
export type { ComparableType } from "./compare.ts";
export type SortCollectionSelector<K, V> = (key: K, value: V) => ComparableType;
const sortCollectionKeySelectorDefault: SortCollectionSelector<ComparableType, unknown> = (key: ComparableType, _value: unknown): ComparableType => {
	return key;
};
const sortCollectionValueSelectorDefault: SortCollectionSelector<unknown, ComparableType> = (_key: unknown, value: ComparableType): ComparableType => {
	return value;
};
function sortCollectionInternal<K, V>(collection: Map<K, V>, selector: SortCollectionSelector<K, V>, options: SortOptions = {}): Map<K, V> {
	return new Map<K, V>(sorter(Array.from(collection.entries(), (entry: [K, V]): SortContext<[K, V]> => {
		return {
			original: entry,
			select: selector(entry[0], entry[1])
		};
	}), options));
}
/**
 * Sort the collection.
 * @template {unknown} K
 * @template {unknown} V
 * @param {Map<K, V>} collection Collection that need to sort by keys.
 * @param {SortCollectionSelector<K, V>} selector Selector to select sortable item.
 * @param {SortOptions} [options={}] Options.
 * @returns {Map<K, V>} A sorted collection.
 */
export function sortCollection<K, V>(collection: Map<K, V>, selector: SortCollectionSelector<K, V>, options?: SortOptions): Map<K, V>;
/**
 * Sort the collection.
 * @template {string} K
 * @template {unknown} V
 * @param {Record<K, V>} collection Collection that need to sort by keys.
 * @param {SortCollectionSelector<K, V>} selector Selector to select sortable item.
 * @param {SortOptions} [options={}] Options.
 * @returns {Record<K, V>} A sorted collection.
 */
export function sortCollection<K extends string, V>(collection: Record<K, V>, selector: SortCollectionSelector<K, V>, options?: SortOptions): Record<K, V>;
//@ts-ignore Overload.
export function sortCollection<K, V>(collection: Map<K, V> | Record<K, V>, selector: SortCollectionSelector<K, V>, options: SortOptions = {}): Map<K, V> | Record<K, V> {
	if (collection instanceof Map) {
		return sortCollectionInternal(collection, selector, options);
	}
	return Object.fromEntries(Array.from(sortCollectionInternal(new Map<K, V>(Object.entries(collection) as [K, V][]), selector, options).entries()));
}
/**
 * Sort the collection by keys.
 * @template {ComparableType} K
 * @template {unknown} V
 * @param {Map<K, V>} collection Collection that need to sort by keys.
 * @param {SortOptions} [options={}] Options.
 * @returns {Map<K, V>} A sorted collection.
 */
export function sortCollectionByKeys<K extends ComparableType, V>(collection: Map<K, V>, options?: SortOptions): Map<K, V>;
/**
 * Sort the collection by keys.
 * @template {string} K
 * @template {unknown} V
 * @param {Record<K, V>} collection Collection that need to sort by keys.
 * @param {SortOptions} [options={}] Options.
 * @returns {Record<K, V>} A sorted collection.
 */
export function sortCollectionByKeys<K extends string, V>(collection: Record<K, V>, options?: SortOptions): Record<K, V>;
//@ts-ignore Overload.
export function sortCollectionByKeys<K, V>(collection: Map<K, V> | Record<K, V>, options: SortOptions = {}): Map<K, V> | Record<K, V> {
	//@ts-ignore Overload.
	return sortCollection(collection, sortCollectionKeySelectorDefault, options);
}
/**
 * Sort the collection by values.
 * @template {unknown} K
 * @template {ComparableType} V
 * @param {Map<K, V>} collection Collection that need to sort by values.
 * @param {SortOptions} [options={}] Options.
 * @returns {Map<K, V>} A sorted collection.
 */
export function sortCollectionByValues<K, V extends ComparableType>(collection: Map<K, V>, options?: SortOptions): Map<K, V>;
/**
 * Sort the collection by values.
 * @template {string} K
 * @template {ComparableType} V
 * @param {Record<K, V>} collection Collection that need to sort by values.
 * @param {SortOptions} [options={}] Options.
 * @returns {Record<K, V>} A sorted collection.
 */
export function sortCollectionByValues<K extends string, V extends ComparableType>(collection: Record<K, V>, options?: SortOptions): Record<K, V>;
//@ts-ignore Overload.
export function sortCollectionByValues<K, V extends ComparableType>(collection: Map<K, V> | Record<K, V>, options: SortOptions = {}): Map<K, V> | Record<K, V> {
	//@ts-ignore Overload.
	return sortCollection(collection, sortCollectionValueSelectorDefault, options);
}
