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
export interface SortCollectionOptions<K> extends SortOptions {
	/**
	 * Select entries key as special entries.
	 */
	specialEntriesKey?: readonly K[] | ((key: K) => boolean);
}
export type SortCollectionSelector<K, V> = (key: K, value: V) => SortableType;
const sortCollectionKeySelectorDefault: SortCollectionSelector<unknown, unknown> = (key: unknown, _value: unknown): SortableType => {
	return key as SortableType;
};
const sortCollectionValueSelectorDefault: SortCollectionSelector<unknown, unknown> = (_key: unknown, value: unknown): SortableType => {
	return value as SortableType;
};
function partitionCollection<K, V>(collection: Map<K, V>, specialEntriesKey: readonly K[] | ((key: K) => boolean) | undefined = []): PartitionResult<Map<K, V>> {
	const rests: [K, V][] = [];
	const specials: [K, V][] = [];
	if (typeof specialEntriesKey === "function") {
		for (const [
			key,
			value
		] of collection.entries()) {
			specialEntriesKey(key) ? specials.push([key, value]) : rests.push([key, value]);
		}
	} else {
		for (const [
			key,
			value
		] of collection.entries()) {
			specialEntriesKey.includes(key) ? specials.push([key, value]) : rests.push([key, value]);
		}
		specials.sort(([a]: [K, V], [b]: [K, V]): number => {
			return (specialEntriesKey.indexOf(a) - specialEntriesKey.indexOf(b));
		});
	}
	return {
		rests: new Map<K, V>(rests),
		specials: new Map<K, V>(specials)
	};
}
function sortCollectionInternal<K, V>(collection: Map<K, V>, selector: SortCollectionSelector<K, V>, options: SortCollectionOptions<K>): Map<K, V> {
	const {
		restOrder = "ascending",
		restPlaceFirst = false,
		smartNumeric = true,
		specialEntriesKey,
		specialOrder = "keep"
	}: SortCollectionOptions<K> = options;
	const {
		rests,
		specials
	}: PartitionResult<Map<K, V>> = partitionCollection(collection, specialEntriesKey);
	const specialsSorted: readonly [K, V][] = sorter(Array.from(specials.entries(), (special: [K, V]): SorterContext<[K, V]> => {
		return {
			original: special,
			select: selector(special[0], special[1])
		};
	}), {
		order: specialOrder,
		smartNumeric
	});
	const restsSorted: readonly [K, V][] = sorter(Array.from(rests.entries(), (rest: [K, V]): SorterContext<[K, V]> => {
		return {
			original: rest,
			select: selector(rest[0], rest[1])
		};
	}), {
		order: restOrder,
		smartNumeric
	});
	return new Map<K, V>(restPlaceFirst ? [...restsSorted, ...specialsSorted] : [...specialsSorted, ...restsSorted]);
}
/**
 * Sort the collection.
 * @template {unknown} K
 * @template {unknown} V
 * @param {Map<K, V>} collection Collection that need to sort by keys.
 * @param {SortCollectionSelector<K, V>} selector Selector to select sortable item.
 * @param {SortCollectionOptions<K>} [options={}] Options.
 * @returns {Map<K, V>} A sorted collection.
 */
export function sortCollection<K, V>(collection: Map<K, V>, selector: SortCollectionSelector<K, V>, options?: SortCollectionOptions<K>): Map<K, V>;
/**
 * Sort the collection.
 * @template {string} K
 * @template {unknown} V
 * @param {Record<K, V>} collection Collection that need to sort by keys.
 * @param {SortCollectionSelector<K, V>} selector Selector to select sortable item.
 * @param {SortCollectionOptions<K>} [options={}] Options.
 * @returns {Record<K, V>} A sorted collection.
 */
export function sortCollection<K extends string, V>(collection: Record<K, V>, selector: SortCollectionSelector<K, V>, options?: SortCollectionOptions<K>): Record<K, V>;
//@ts-ignore Overload.
export function sortCollection<K, V>(collection: Map<K, V> | Record<K, V>, selector: SortCollectionSelector<K, V>, options: SortCollectionOptions<K> = {}): Map<K, V> | Record<K, V> {
	if (collection instanceof Map) {
		return sortCollectionInternal(collection, selector, options);
	}
	return Object.fromEntries(Array.from(sortCollectionInternal(new Map<K, V>(Object.entries(collection) as [K, V][]), selector, options).entries()));
}
/**
 * Sort the collection by keys.
 * @template {SortableType} K
 * @template {unknown} V
 * @param {Map<K, V>} collection Collection that need to sort by keys.
 * @param {SortCollectionOptions<K>} [options={}] Options.
 * @returns {Map<K, V>} A sorted collection.
 */
export function sortCollectionByKeys<K extends SortableType, V>(collection: Map<K, V>, options?: SortCollectionOptions<K>): Map<K, V>;
/**
 * Sort the collection by keys.
 * @template {string} K
 * @template {unknown} V
 * @param {Record<K, V>} collection Collection that need to sort by keys.
 * @param {SortCollectionOptions<K>} [options={}] Options.
 * @returns {Record<K, V>} A sorted collection.
 */
export function sortCollectionByKeys<K extends string, V>(collection: Record<K, V>, options?: SortCollectionOptions<K>): Record<K, V>;
//@ts-ignore Overload.
export function sortCollectionByKeys<K, V>(collection: Map<K, V> | Record<K, V>, options: SortCollectionOptions<K> = {}): Map<K, V> | Record<K, V> {
	if (collection instanceof Map) {
		return sortCollectionInternal(collection, sortCollectionKeySelectorDefault, options);
	}
	return Object.fromEntries(Array.from(sortCollectionInternal(new Map<K, V>(Object.entries(collection) as [K, V][]), sortCollectionKeySelectorDefault, options).entries()));
}
/**
 * Sort the collection by values.
 * @template {unknown} K
 * @template {SortableType} V
 * @param {Map<K, V>} collection Collection that need to sort by values.
 * @param {SortCollectionOptions<K>} [options={}] Options.
 * @returns {Map<K, V>} A sorted collection.
 */
export function sortCollectionByValues<K, V extends SortableType>(collection: Map<K, V>, options?: SortCollectionOptions<K>): Map<K, V>;
/**
 * Sort the collection by values.
 * @template {string} K
 * @template {SortableType} V
 * @param {Record<K, V>} collection Collection that need to sort by values.
 * @param {SortCollectionOptions<K>} [options={}] Options.
 * @returns {Record<K, V>} A sorted collection.
 */
export function sortCollectionByValues<K extends string, V extends SortableType>(collection: Record<K, V>, options?: SortCollectionOptions<K>): Record<K, V>;
//@ts-ignore Overload.
export function sortCollectionByValues<K, V extends SortableType>(collection: Map<K, V> | Record<K, V>, options: SortCollectionOptions<K> = {}): Map<K, V> | Record<K, V> {
	if (collection instanceof Map) {
		return sortCollectionInternal(collection, sortCollectionValueSelectorDefault, options);
	}
	return Object.fromEntries(Array.from(sortCollectionInternal(new Map<K, V>(Object.entries(collection) as [K, V][]), sortCollectionValueSelectorDefault, options).entries()));
}
