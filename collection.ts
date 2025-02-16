import {
	sortRest,
	type SortOptions,
	type SortOrder
} from "./_common.ts";
export type {
	SortOptions,
	SortOrder
};
export interface SortCollectionByKeysOptions<T> {
	/**
	 * Sort these special keys in this specify order.
	 */
	keysSpecial?: readonly T[];
}
function partitionSpecialCollectionKeys<K, V>(collection: Map<K, V>, keysSpecial: readonly K[]): [specials: Map<K, V>, rests: Map<K, V>] {
	const specials: Map<K, V> = new Map<K, V>();
	const rests: Map<K, V> = new Map<K, V>();
	for (const [key, value] of collection.entries()) {
		keysSpecial.includes(key) ? specials.set(key, value) : rests.set(key, value);
	}
	const specialsSorted: Map<K, V> = new Map<K, V>(Array.from(specials.entries()).sort(([aKey]: [K, V], [bKey]: [K, V]): number => {
		return (keysSpecial.indexOf(aKey) - keysSpecial.indexOf(bKey));
	}));
	return [specialsSorted, rests];
}
function sortCollectionByKeysInternal<K extends bigint | number | string, V>(collection: Map<K, V>, options: SortOptions & SortCollectionByKeysOptions<K>): Map<K, V> {
	const {
		keysSpecial = [],
		restPlaceFirst = false
	}: SortOptions & SortCollectionByKeysOptions<K> = options;
	const [
		specials,
		rests
	]: [specials: Map<K, V>, rests: Map<K, V>] = partitionSpecialCollectionKeys(collection, keysSpecial);
	const restsKeySorted: readonly K[] = sortRest(Array.from(rests.keys()), options);
	const restsSorted: Map<K, V> = new Map<K, V>(Array.from(rests.entries()).sort(([aKey]: [K, V], [bKey]: [K, V]): number => {
		return (restsKeySorted.indexOf(aKey) - restsKeySorted.indexOf(bKey));
	}));
	return new Map<K, V>(restPlaceFirst ? [...Array.from(restsSorted.entries()), ...Array.from(specials.entries())] : [...Array.from(specials.entries()), ...Array.from(restsSorted.entries())]);
}
/**
 * Sort the collection by keys.
 * @template {bigint | number | string} K
 * @template {unknown} V
 * @param {Map<K, V>} collection Collection that need to sort by keys.
 * @param {SortOptions & SortCollectionByKeysOptions<K>} [options={}] Options.
 * @returns {Map<K, V>} A sorted collection.
 */
export function sortCollectionByKeys<K extends bigint | number | string, V>(collection: Map<K, V>, options?: SortOptions & SortCollectionByKeysOptions<K>): Map<K, V>;
/**
 * Sort the collection by keys.
 * @template {string} K
 * @template {unknown} V
 * @param {Record<K, V>} collection Collection that need to sort by keys.
 * @param {SortOptions & SortCollectionByKeysOptions<K>} [options={}] Options.
 * @returns {Record<K, V>} A sorted collection.
 */
export function sortCollectionByKeys<K extends string, V>(collection: Record<K, V>, options?: SortOptions & SortCollectionByKeysOptions<K>): Record<K, V>;
export function sortCollectionByKeys<KM extends bigint | number | string, KR extends string, V>(collection: Map<KM, V> | Record<KR, V>, options: SortOptions & (SortCollectionByKeysOptions<KM> | SortCollectionByKeysOptions<KR>) = {}): Map<KM, V> | Record<KR, V> {
	if (collection instanceof Map) {
		return sortCollectionByKeysInternal(collection, options as SortOptions & SortCollectionByKeysOptions<KM>);
	}
	return Object.fromEntries(sortCollectionByKeysInternal(new Map<KR, V>(Object.entries(collection) as [KR, V][]), options as SortOptions & SortCollectionByKeysOptions<KR>)) as Record<KR, V>;
}
