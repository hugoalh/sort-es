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
function sortCollectionByKeysInternal<K extends SortableType, V>(collection: Map<K, V>, options: SortOptions & SortCollectionByKeysOptions<K>): Map<K, V> {
	const {
		keysSpecial = [],
		restPlaceFirst = false
	}: SortOptions & SortCollectionByKeysOptions<K> = options;
	const [
		specials,
		rests
	]: [specials: Map<K, V>, rests: Map<K, V>] = partitionSpecialCollectionKeys(collection, keysSpecial);
	const restsKeySorted: readonly K[] = sort(Array.from(rests.keys()), options);
	const restsSorted: Map<K, V> = new Map<K, V>(Array.from(rests.entries()).sort(([aKey]: [K, V], [bKey]: [K, V]): number => {
		return (restsKeySorted.indexOf(aKey) - restsKeySorted.indexOf(bKey));
	}));
	return new Map<K, V>(restPlaceFirst ? [...Array.from(restsSorted.entries()), ...Array.from(specials.entries())] : [...Array.from(specials.entries()), ...Array.from(restsSorted.entries())]);
}
/**
 * Sort the collection by keys.
 * @template {SortableType} K
 * @template {unknown} V
 * @param {Map<K, V>} collection Collection that need to sort by keys.
 * @param {SortOptions & SortCollectionByKeysOptions<K>} [options={}] Options.
 * @returns {Map<K, V>} A sorted collection.
 */
export function sortCollectionByKeys<K extends SortableType, V>(collection: Map<K, V>, options?: SortOptions & SortCollectionByKeysOptions<K>): Map<K, V>;
/**
 * Sort the collection by keys.
 * @template {string} K
 * @template {unknown} V
 * @param {Record<K, V>} collection Collection that need to sort by keys.
 * @param {SortOptions & SortCollectionByKeysOptions<K>} [options={}] Options.
 * @returns {Record<K, V>} A sorted collection.
 */
export function sortCollectionByKeys<K extends string, V>(collection: Record<K, V>, options?: SortOptions & SortCollectionByKeysOptions<K>): Record<K, V>;
export function sortCollectionByKeys<KM extends SortableType, KR extends string, V>(collection: Map<KM, V> | Record<KR, V>, options: SortOptions & (SortCollectionByKeysOptions<KM> | SortCollectionByKeysOptions<KR>) = {}): Map<KM, V> | Record<KR, V> {
	if (collection instanceof Map) {
		return sortCollectionByKeysInternal(collection, options as SortOptions & SortCollectionByKeysOptions<KM>);
	}
	return Object.fromEntries(sortCollectionByKeysInternal(new Map<KR, V>(Object.entries(collection) as [KR, V][]), options as SortOptions & SortCollectionByKeysOptions<KR>)) as Record<KR, V>;
}
function sortCollectionByValuesInternal<K, V extends SortableType>(collection: Map<K, V>, options: SortOptions & SortCollectionByKeysOptions<K>): Map<K, V> {
	const {
		keysSpecial = [],
		restPlaceFirst = false
	}: SortOptions & SortCollectionByKeysOptions<K> = options;
	const [
		specials,
		rests
	]: [specials: Map<K, V>, rests: Map<K, V>] = partitionSpecialCollectionKeys(collection, keysSpecial);
	const restsValueSorted: readonly V[] = sort(Array.from(rests.values()), options);
	const restsSorted: Map<K, V> = new Map<K, V>(Array.from(rests.entries()).sort(([_aKey, aValue]: [K, V], [_bKey, bValue]: [K, V]): number => {
		return (restsValueSorted.indexOf(aValue) - restsValueSorted.indexOf(bValue));
	}));
	return new Map<K, V>(restPlaceFirst ? [...Array.from(restsSorted.entries()), ...Array.from(specials.entries())] : [...Array.from(specials.entries()), ...Array.from(restsSorted.entries())]);
}
/**
 * Sort the collection by values.
 * @template {unknown} K
 * @template {SortableType} V
 * @param {Map<K, V>} collection Collection that need to sort by values.
 * @param {SortOptions & SortCollectionByKeysOptions<K>} [options={}] Options.
 * @returns {Map<K, V>} A sorted collection.
 */
export function sortCollectionByValues<K, V extends SortableType>(collection: Map<K, V>, options?: SortOptions & SortCollectionByKeysOptions<K>): Map<K, V>;
/**
 * Sort the collection by values.
 * @template {string} K
 * @template {SortableType} V
 * @param {Record<K, V>} collection Collection that need to sort by values.
 * @param {SortOptions & SortCollectionByKeysOptions<K>} [options={}] Options.
 * @returns {Record<K, V>} A sorted collection.
 */
export function sortCollectionByValues<K extends string, V extends SortableType>(collection: Record<K, V>, options?: SortOptions & SortCollectionByKeysOptions<K>): Record<K, V>;
export function sortCollectionByValues<KM, KR extends string, V extends SortableType>(collection: Map<KM, V> | Record<KR, V>, options: SortOptions & (SortCollectionByKeysOptions<KM> | SortCollectionByKeysOptions<KR>) = {}): Map<KM, V> | Record<KR, V> {
	if (collection instanceof Map) {
		return sortCollectionByValuesInternal(collection, options as SortOptions & SortCollectionByKeysOptions<KM>);
	}
	return Object.fromEntries(sortCollectionByValuesInternal(new Map<KR, V>(Object.entries(collection) as [KR, V][]), options as SortOptions & SortCollectionByKeysOptions<KR>)) as Record<KR, V>;
}
function sortCollectionByValuesSelectorInternal<K, V>(collection: Map<K, V>, selector: SortElementsSelector<V>, options: SortOptions & SortCollectionByKeysOptions<K>): Map<K, V> {
	const {
		keysSpecial = [],
		restPlaceFirst = false
	}: SortOptions & SortCollectionByKeysOptions<K> = options;
	const [
		specials,
		rests
	]: [specials: Map<K, V>, rests: Map<K, V>] = partitionSpecialCollectionKeys(collection, keysSpecial);
	const restsValueSelector: readonly SortableType[] = sort(Array.from(rests.values(), (element: V): SortableType => {
		return selector(element);
	}), options);
	const restsSorted: Map<K, V> = new Map<K, V>(Array.from(rests.entries()).sort(([_aKey, aValue]: [K, V], [_bKey, bValue]: [K, V]): number => {
		return (restsValueSelector.indexOf(selector(aValue)) - restsValueSelector.indexOf(selector(bValue)));
	}));
	return new Map<K, V>(restPlaceFirst ? [...Array.from(restsSorted.entries()), ...Array.from(specials.entries())] : [...Array.from(specials.entries()), ...Array.from(restsSorted.entries())]);
}
/**
 * Sort the collection by values selector.
 * @template {unknown} K
 * @template {unknown} V
 * @param {Map<K, V>} collection Collection that need to sort by values selector.
 * @param {SortElementsSelector<V>} selector Selector.
 * @param {SortOptions & SortCollectionByKeysOptions<K>} [options={}] Options.
 * @returns {Map<K, V>} A sorted collection.
 */
export function sortCollectionByValuesSelector<K, V>(collection: Map<K, V>, selector: SortElementsSelector<V>, options?: SortOptions & SortCollectionByKeysOptions<K>): Map<K, V>;
/**
 * Sort the collection by values selector.
 * @template {string} K
 * @template {unknown} V
 * @param {Record<K, V>} collection Collection that need to sort by values selector.
 * @param {SortElementsSelector<V>} selector Selector.
 * @param {SortOptions & SortCollectionByKeysOptions<K>} [options={}] Options.
 * @returns {Record<K, V>} A sorted collection.
 */
export function sortCollectionByValuesSelector<K extends string, V>(collection: Record<K, V>, selector: SortElementsSelector<V>, options?: SortOptions & SortCollectionByKeysOptions<K>): Record<K, V>;
export function sortCollectionByValuesSelector<KM, KR extends string, V>(collection: Map<KM, V> | Record<KR, V>, selector: SortElementsSelector<V>, options: SortOptions & (SortCollectionByKeysOptions<KM> | SortCollectionByKeysOptions<KR>) = {}): Map<KM, V> | Record<KR, V> {
	if (collection instanceof Map) {
		return sortCollectionByValuesSelectorInternal(collection, selector, options as SortOptions & SortCollectionByKeysOptions<KM>);
	}
	return Object.fromEntries(sortCollectionByValuesSelectorInternal(new Map<KR, V>(Object.entries(collection) as [KR, V][]), selector, options as SortOptions & SortCollectionByKeysOptions<KR>)) as Record<KR, V>;
}
