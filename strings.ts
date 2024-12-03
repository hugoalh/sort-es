import {
	compareNumerics,
	getSortOrderValidValues,
	partitionSpecials,
	SortOrder,
	type SortOptions
} from "./_common.ts";
export type {
	SortOptions
};
export interface SortStringsOptions {
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
	const [partSpecials, partRests] = partitionSpecials(item, specials);
	const restOrderFmt: `${SortOrder}` | undefined = SortOrder[restOrder];
	switch (restOrderFmt) {
		case "ascending":
		case "descending":
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
							// This is impossible to happen, just for fulfill type guard.
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
			break;
		case "keep":
			break;
		default:
			throw new RangeError(`\`${restOrder}\` is not a valid sort order! Only accept these values: ${getSortOrderValidValues()}`);
	}
	return (restPlaceFirst ? [...partRests, ...partSpecials] : [...partSpecials, ...partRests]);
}
export function sortStrings(item: readonly string[], options?: SortOptions<string> & SortStringsOptions): string[];
export function sortStrings(item: Set<string>, options?: SortOptions<string> & SortStringsOptions): Set<string>;
export function sortStrings(item: (readonly string[]) | Set<string>, options: SortOptions<string> & SortStringsOptions = {}): string[] | Set<string> {
	if (item instanceof Set) {
		return new Set<string>(sortStringsInternal(Array.from(item.values()), options));
	}
	return sortStringsInternal(item, options);
}
export default sortStrings;
export function sortStringsGeneric<T extends string>(item: readonly T[], options?: SortOptions<T> & SortStringsOptions): T[];
export function sortStringsGeneric<T extends string>(item: Set<T>, options?: SortOptions<T> & SortStringsOptions): Set<T>;
export function sortStringsGeneric<T extends string>(item: (readonly T[]) | Set<T>, options: SortOptions<string> & SortStringsOptions = {}): T[] | Set<T> {
	//@ts-ignore Overloads.
	return sortStrings(item, options);
}
