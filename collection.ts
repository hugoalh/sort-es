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
function sortCollectionByKeysInternal<K extends SortableType, V>(collection: Map<K, V>, options: SortCollectionOptions<K>): Map<K, V> {
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
	const specialsKeySorted: readonly K[] = sort(Array.from(specials.keys()), {
		order: specialOrder,
		smartNumeric
	});
	const specialsSorted: Map<K, V> = new Map<K, V>(Array.from(specials.entries()).sort(([aKey]: [K, V], [bKey]: [K, V]): number => {
		return (specialsKeySorted.indexOf(aKey) - specialsKeySorted.indexOf(bKey));
	}));
	const restsKeySorted: readonly K[] = sort(Array.from(rests.keys()), {
		order: restOrder,
		smartNumeric
	});
	const restsSorted: Map<K, V> = new Map<K, V>(Array.from(rests.entries()).sort(([aKey]: [K, V], [bKey]: [K, V]): number => {
		return (restsKeySorted.indexOf(aKey) - restsKeySorted.indexOf(bKey));
	}));
	return new Map<K, V>(restPlaceFirst ? [...Array.from(restsSorted.entries()), ...Array.from(specialsSorted.entries())] : [...Array.from(specialsSorted.entries()), ...Array.from(restsSorted.entries())]);
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
		return sortCollectionByKeysInternal(collection, options as SortCollectionOptions<KM>);
	}
	return Object.fromEntries(sortCollectionByKeysInternal(new Map<KR, V>(Object.entries(collection) as [KR, V][]), options as SortCollectionOptions<KR>)) as Record<KR, V>;
}
function sortCollectionByValuesInternal<K, V extends SortableType>(collection: Map<K, V>, options: SortCollectionOptions<K>): Map<K, V> {
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
	const specialsValueSorted: readonly V[] = sort(Array.from(specials.values()), {
		order: specialOrder,
		smartNumeric
	});
	const specialsSorted: Map<K, V> = new Map<K, V>(Array.from(specials.entries()).sort(([_aKey, aValue]: [K, V], [_bKey, bValue]: [K, V]): number => {
		return (specialsValueSorted.indexOf(aValue) - specialsValueSorted.indexOf(bValue));
	}));
	const restsValueSorted: readonly V[] = sort(Array.from(rests.values()), {
		order: restOrder,
		smartNumeric
	});
	const restsSorted: Map<K, V> = new Map<K, V>(Array.from(rests.entries()).sort(([_aKey, aValue]: [K, V], [_bKey, bValue]: [K, V]): number => {
		return (restsValueSorted.indexOf(aValue) - restsValueSorted.indexOf(bValue));
	}));
	return new Map<K, V>(restPlaceFirst ? [...Array.from(restsSorted.entries()), ...Array.from(specialsSorted.entries())] : [...Array.from(specialsSorted.entries()), ...Array.from(restsSorted.entries())]);
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
function sortCollectionByValuesSelectorInternal<K, V>(collection: Map<K, V>, selector: SortElementsSelector<V>, options: SortCollectionOptions<K>): Map<K, V> {
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
	const specialsValueSelectorSorted: readonly SortableType[] = sort(Array.from(specials.values(), (element: V): SortableType => {
		return selector(element);
	}), {
		order: specialOrder,
		smartNumeric
	});
	const specialsSorted: Map<K, V> = new Map<K, V>(Array.from(specials.entries()).sort(([_aKey, aValue]: [K, V], [_bKey, bValue]: [K, V]): number => {
		return (specialsValueSelectorSorted.indexOf(selector(aValue)) - specialsValueSelectorSorted.indexOf(selector(bValue)));
	}));
	const restsValueSorted: readonly SortableType[] = sort(Array.from(rests.values(), (element: V): SortableType => {
		return selector(element);
	}), {
		order: restOrder,
		smartNumeric
	});
	const restsSorted: Map<K, V> = new Map<K, V>(Array.from(rests.entries()).sort(([_aKey, aValue]: [K, V], [_bKey, bValue]: [K, V]): number => {
		return (restsValueSorted.indexOf(selector(aValue)) - restsValueSorted.indexOf(selector(bValue)));
	}));
	return new Map<K, V>(restPlaceFirst ? [...Array.from(restsSorted.entries()), ...Array.from(specialsSorted.entries())] : [...Array.from(specialsSorted.entries()), ...Array.from(restsSorted.entries())]);
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
		return sortCollectionByValuesSelectorInternal(collection, selector, options as SortCollectionOptions<KM>);
	}
	return Object.fromEntries(sortCollectionByValuesSelectorInternal(new Map<KR, V>(Object.entries(collection) as [KR, V][]), selector, options as SortCollectionOptions<KR>)) as Record<KR, V>;
}
