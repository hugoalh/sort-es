import {
	partitionSpecials,
	type SortOptions
} from "./_common.ts";
import { sortNumerics } from "./numerics.ts";
import {
	sortStrings,
	type SortStringsOptions
} from "./strings.ts";
export type {
	SortOptions,
	SortStringsOptions
};
function sortCollectionByKeysInternal<V>(item: Map<bigint | number, V>, options: SortOptions<bigint | number>): Map<bigint | number, V>;
function sortCollectionByKeysInternal<V>(item: Map<string, V>, options: SortOptions<string> & SortStringsOptions): Map<string, V>;
function sortCollectionByKeysInternal<V>(item: Map<bigint | number | string, V>, options: SortOptions<bigint | number | string> & SortStringsOptions): Map<bigint | number | string, V> {
	const {
		restOrder = "ascending",
		restPlaceFirst = false,
		smartNumeric = false,
		specials = []
	}: SortOptions<bigint | number | string> & SortStringsOptions = options;
	const itemKeys: (bigint | number | string)[] = Array.from(item.keys());
	const partSpecials: Map<bigint | number | string, V> = new Map<bigint | number | string, V>();
	const partRests: Map<bigint | number | string, V> = new Map<bigint | number | string, V>();
	const [partSpecialsKey, partRestsKey] = partitionSpecials(itemKeys, specials);
	for (const partSpecialKey of partSpecialsKey) {
		partSpecials.set(partSpecialKey, item.get(partSpecialKey)!);
	}
	if (itemKeys.every((itemKey: bigint | number | string): itemKey is bigint | number => {
		return (
			typeof itemKey === "bigint" ||
			typeof itemKey === "number"
		);
	})) {
		for (const itemKey of sortNumerics(partRestsKey as (bigint | number)[], { restOrder })) {
			partRests.set(itemKey, item.get(itemKey)!);
		}
	} else if (itemKeys.every((itemKey: bigint | number | string): itemKey is string => {
		return (typeof itemKey === "string");
	})) {
		for (const itemKey of sortStrings(partRestsKey as string[], {
			restOrder,
			smartNumeric
		})) {
			partRests.set(itemKey, item.get(itemKey)!);
		}
	} else {
		throw new TypeError();
	}
	const result: Map<bigint | number | string, V> = new Map<bigint | number | string, V>();
	if (restPlaceFirst) {
		for (const [key, value] of partRests.entries()) {
			result.set(key, value);
		}
		for (const [key, value] of partSpecials.entries()) {
			result.set(key, value);
		}
	} else {
		for (const [key, value] of partSpecials.entries()) {
			result.set(key, value);
		}
		for (const [key, value] of partRests.entries()) {
			result.set(key, value);
		}
	}
	return result;
}
export function sortCollectionByKeys<V>(item: { [key: string]: V; }, options?: SortOptions<string> & SortStringsOptions): { [key: string]: V; };
export function sortCollectionByKeys<V>(item: Map<bigint, V>, options?: SortOptions<bigint>): Map<bigint, V>;
export function sortCollectionByKeys<V>(item: Map<number, V>, options?: SortOptions<number>): Map<number, V>;
export function sortCollectionByKeys<V>(item: Map<bigint | number, V>, options?: SortOptions<bigint | number>): Map<bigint | number, V>;
export function sortCollectionByKeys<V>(item: Map<string, V>, options?: SortOptions<string> & SortStringsOptions): Map<string, V>;
export function sortCollectionByKeys<V>(item: Record<string, V>, options?: SortOptions<string> & SortStringsOptions): Record<string, V>;
export function sortCollectionByKeys<V>(item: { [key: string]: V; } | Map<bigint, V> | Map<number, V> | Map<bigint | number, V> | Map<string, V> | Record<string, V>, options: SortOptions<bigint | number | string> & SortStringsOptions = {}): { [key: string]: V; } | Map<bigint, V> | Map<number, V> | Map<bigint | number, V> | Map<string, V> | Record<string, V> {
	if (item instanceof Map) {
		//@ts-ignore Overloads.
		return sortCollectionByKeysInternal(item, options);
	}
	//@ts-ignore Overloads.
	return Object.fromEntries(sortCollectionByKeysInternal(new Map<string, V>(Object.entries(item)), options));
}
export function sortCollectionByKeysGeneric<K extends bigint | number, V>(item: Map<K, V>, options?: SortOptions<K>): Map<K, V>;
export function sortCollectionByKeysGeneric<K extends string, V>(item: Map<K, V>, options?: SortOptions<K> & SortStringsOptions): Map<K, V>;
export function sortCollectionByKeysGeneric<K extends string, V>(item: Record<K, V>, options?: SortOptions<K> & SortStringsOptions): Record<K, V>;
export function sortCollectionByKeysGeneric<KN extends bigint | number, KS extends string, V>(item: Map<KN, V> | Map<KS, V> | Record<KS, V>, options: SortOptions<KN | KS> & SortStringsOptions = {}): Map<KN, V> | Map<KS, V> | Record<KS, V> {
	//@ts-ignore Overloads.
	return sortCollectionByKeys(item, options);
}
