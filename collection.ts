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
export interface SortCollectionOptions<T> extends SortOptions {
	/**
	 * Pick these entries key as special, sort these special entries key in specify order (property {@linkcode specialOrder}) and place first unless the rest entries key should place first (property {@linkcode restPlaceFirst}).
	 */
	specialKeys?: readonly T[] | ((element: T) => boolean);
}
function partitionCollectionByKeys<K, V>(collection: Map<K, V>, specialKeys: readonly K[] | ((element: K) => boolean) | undefined = []): PartitionResult<Map<K, V>> {
	const rests: Map<K, V> = new Map<K, V>();
	let specials: Map<K, V>;
	if (typeof specialKeys === "function") {
		specials = new Map<K, V>();
		for (const [key, value] of collection.entries()) {
			specialKeys(key) ? specials.set(key, value) : rests.set(key, value);
		}
	} else {
		const specialsTemp: Map<K, V> = new Map<K, V>();
		for (const [key, value] of collection.entries()) {
			specialKeys.includes(key) ? specialsTemp.set(key, value) : rests.set(key, value);
		}
		specials = new Map<K, V>(Array.from(specialsTemp.entries()).sort(([aKey]: [K, V], [bKey]: [K, V]): number => {
			return (specialKeys.indexOf(aKey) - specialKeys.indexOf(bKey));
		}));
	}
	return {
		rests,
		specials
	};
}
const sortCollectionKeysSelector: SortElementsSelector<[unknown, unknown]> = ([key]: [unknown, unknown]): SortableType => {
	return key as SortableType;
};
const sortCollectionValuesSelector: SortElementsSelector<[unknown, unknown]> = ([_key, value]: [unknown, unknown]): SortableType => {
	return value as SortableType;
};
function sortCollectionInternal<K, V>(collection: Map<K, V>, options: SortCollectionOptions<K>, selector: SortElementsSelector<[K, V]>): Map<K, V> {
	const {
		restOrder = "ascending",
		restPlaceFirst = false,
		smartNumeric = false,
		specialKeys,
		specialOrder = "keep"
	}: SortCollectionOptions<K> = options;
	const {
		rests,
		specials
	}: PartitionResult<Map<K, V>> = partitionCollectionByKeys(collection, specialKeys);
	const specialsSorted: readonly [K, V][] = sort(Array.from(specials.entries()), {
		order: specialOrder,
		selector,
		smartNumeric
	});
	const restsSorted: readonly [K, V][] = sort(Array.from(rests.entries()), {
		order: restOrder,
		selector,
		smartNumeric
	});
	return new Map<K, V>(restPlaceFirst ? [...restsSorted, ...specialsSorted] : [...specialsSorted, ...restsSorted]);
}
function sortCollectionByValuesInternal<K, V>(collection: Map<K, V>, options: SortCollectionOptions<K>, selector?: SortElementsSelector<V>): Map<K, V> {
	return sortCollectionInternal(collection, options, (typeof selector === "undefined") ? sortCollectionValuesSelector : (([_key, value]: [K, V]): SortableType => {
		return selector(value);
	}));
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
export function sortCollectionByKeys<KM extends SortableType, KR extends string, V>(collection: Map<KM, V> | Record<KR, V>, options: (SortCollectionOptions<KM> | SortCollectionOptions<KR>) = {}): Map<KM, V> | Record<KR, V> {
	if (collection instanceof Map) {
		return sortCollectionInternal(collection, options as SortCollectionOptions<KM>, sortCollectionKeysSelector);
	}
	return Object.fromEntries(sortCollectionInternal(new Map<KR, V>(Object.entries(collection) as [KR, V][]), options as SortCollectionOptions<KR>, sortCollectionKeysSelector)) as Record<KR, V>;
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
export function sortCollectionByValues<KM, KR extends string, V extends SortableType>(collection: Map<KM, V> | Record<KR, V>, options: (SortCollectionOptions<KM> | SortCollectionOptions<KR>) = {}): Map<KM, V> | Record<KR, V> {
	if (collection instanceof Map) {
		return sortCollectionByValuesInternal(collection, options as SortCollectionOptions<KM>);
	}
	return Object.fromEntries(sortCollectionByValuesInternal(new Map<KR, V>(Object.entries(collection) as [KR, V][]), options as SortCollectionOptions<KR>)) as Record<KR, V>;
}
/**
 * Sort the collection by values selector.
 * @template {unknown} K
 * @template {unknown} V
 * @param {Map<K, V>} collection Collection that need to sort by values selector.
 * @param {SortElementsSelector<V>} selector Selector.
 * @param {SortCollectionOptions<K>} [options={}] Options.
 * @returns {Map<K, V>} A sorted collection.
 */
export function sortCollectionByValuesSelector<K, V>(collection: Map<K, V>, selector: SortElementsSelector<V>, options?: SortCollectionOptions<K>): Map<K, V>;
/**
 * Sort the collection by values selector.
 * @template {string} K
 * @template {unknown} V
 * @param {Record<K, V>} collection Collection that need to sort by values selector.
 * @param {SortElementsSelector<V>} selector Selector.
 * @param {SortCollectionOptions<K>} [options={}] Options.
 * @returns {Record<K, V>} A sorted collection.
 */
export function sortCollectionByValuesSelector<K extends string, V>(collection: Record<K, V>, selector: SortElementsSelector<V>, options?: SortCollectionOptions<K>): Record<K, V>;
export function sortCollectionByValuesSelector<KM, KR extends string, V>(collection: Map<KM, V> | Record<KR, V>, selector: SortElementsSelector<V>, options: (SortCollectionOptions<KM> | SortCollectionOptions<KR>) = {}): Map<KM, V> | Record<KR, V> {
	if (collection instanceof Map) {
		return sortCollectionByValuesInternal(collection, options as SortCollectionOptions<KM>, selector);
	}
	return Object.fromEntries(sortCollectionByValuesInternal(new Map<KR, V>(Object.entries(collection) as [KR, V][]), options as SortCollectionOptions<KR>, selector)) as Record<KR, V>;
}
