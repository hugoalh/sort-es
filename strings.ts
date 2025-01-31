import {
	compareNumerics,
	partitionSpecials,
	resolveSortOrder,
	type SortOptions,
	type SortOrder
} from "./_common.ts";
export type {
	SortOptions
};
export interface SortStringsOptions {
	/**
	 * Whether to correctly handle numeric.
	 * @default {false}
	 */
	smartNumeric?: boolean;
}
const regexpDigits = /\d+/g;
function dissectStringNumeric(item: string): (bigint | string)[] {
	const result: (bigint | string)[] = [];
	let cursor: number = 0;
	for (const element of item.matchAll(regexpDigits)) {
		if (cursor < element.index) {
			result.push(item.slice(cursor, element.index));
		}
		result.push(BigInt(element[0]));
		cursor = element.index + element[0].length;
	}
	result.push(item.slice(cursor, item.length));
	return result;
}
function sortStringsInternal(item: readonly string[], options: SortOptions<string> & SortStringsOptions): string[] {
	const {
		restOrder = "ascending",
		restPlaceFirst = false,
		smartNumeric = false,
		specials = []
	}: SortOptions<string> & SortStringsOptions = options;
	const [partSpecials, partRests]: [specials: string[], rests: string[]] = partitionSpecials(item, specials);
	const restOrderFmt: SortOrder = resolveSortOrder(restOrder);
	if (restOrderFmt !== "keep") {
		if (smartNumeric) {
			partRests.sort((a: string, b: string): number => {
				const aFmt: readonly (bigint | string)[] = dissectStringNumeric(a);
				const bFmt: readonly (bigint | string)[] = dissectStringNumeric(b);
				const sections: number = Math.max(aFmt.length, bFmt.length);
				for (let index: number = 0; index < sections; index += 1) {
					const aPart: bigint | string | undefined = aFmt[index];
					const bPart: bigint | string | undefined = bFmt[index];
					if (typeof aPart === "undefined" && typeof bPart !== "undefined") {
						return -1;
					}
					if (typeof aPart !== "undefined" && typeof bPart === "undefined") {
						return 1;
					}
					if (typeof aPart === "undefined" && typeof bPart === "undefined") {
						// This is impossible to happen, just for fulfill the type guard.
						break;
					}
					if (aPart === bPart) {
						continue;
					}
					if (typeof aPart === "bigint" && typeof bPart === "bigint") {
						return compareNumerics(aPart, bPart);
					}
					return (([aPart, bPart].sort()[0] === aPart) ? -1 : 1);
				}
				return 0;
			});
		} else {
			partRests.sort();
		}
		if (restOrderFmt === "descending") {
			partRests.reverse();
		}
	}
	return (restPlaceFirst ? [...partRests, ...partSpecials] : [...partSpecials, ...partRests]);
}
/**
 * Sort the strings.
 * @param {readonly string[]} item Strings that need to sort.
 * @param {SortOptions<string> & SortStringsOptions} [options={}] Options.
 * @returns {string[]} A sorted strings.
 */
export function sortStrings(item: readonly string[], options?: SortOptions<string> & SortStringsOptions): string[];
/**
 * Sort the strings.
 * @param {Set<string>} item Strings that need to sort.
 * @param {SortOptions<string> & SortStringsOptions} [options={}] Options.
 * @returns {Set<string>} A sorted strings.
 */
export function sortStrings(item: Set<string>, options?: SortOptions<string> & SortStringsOptions): Set<string>;
export function sortStrings(item: (readonly string[]) | Set<string>, options: SortOptions<string> & SortStringsOptions = {}): string[] | Set<string> {
	if (item instanceof Set) {
		return new Set<string>(sortStringsInternal(Array.from(item.values()), options));
	}
	return sortStringsInternal(item, options);
}
export default sortStrings;
/**
 * Sort the strings, with generic.
 * @template {string} T
 * @param {readonly T[]} item Strings that need to sort.
 * @param {SortOptions<T> & SortStringsOptions} [options={}] Options.
 * @returns {T[]} A sorted strings.
 */
export function sortStringsGeneric<T extends string>(item: readonly T[], options?: SortOptions<T> & SortStringsOptions): T[];
/**
 * Sort the strings, with generic.
 * @template {string} T
 * @param {Set<T>} item Strings that need to sort.
 * @param {SortOptions<T> & SortStringsOptions} [options={}] Options.
 * @returns {Set<T>} A sorted strings.
 */
export function sortStringsGeneric<T extends string>(item: Set<T>, options?: SortOptions<T> & SortStringsOptions): Set<T>;
export function sortStringsGeneric<T extends string>(item: (readonly T[]) | Set<T>, options: SortOptions<string> & SortStringsOptions = {}): T[] | Set<T> {
	//@ts-ignore Overloads.
	return sortStrings(item, options);
}
