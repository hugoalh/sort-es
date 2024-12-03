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
function sortNumericsInternal(item: readonly (bigint | number)[], options: SortOptions<bigint | number>): (bigint | number)[] {
	const {
		restOrder = "ascending",
		restPlaceFirst = false,
		specials = []
	}: SortOptions<bigint | number> = options;
	const [partSpecials, partRests] = partitionSpecials(item, specials);
	const restOrderFmt: `${SortOrder}` | undefined = SortOrder[restOrder];
	switch (restOrderFmt) {
		case "ascending":
		case "descending":
			partRests.sort((a: bigint | number, b: bigint | number): number => {
				if (typeof a === "bigint" && typeof b === "bigint") {
					return compareNumerics(a, b);
				}
				if (typeof a === "number" && typeof b === "number") {
					return compareNumerics(a, b);
				}
				return compareNumerics(Number(a), Number(b));
			});
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
export function sortNumerics(item: readonly bigint[], options?: SortOptions<bigint>): bigint[];
export function sortNumerics(item: Set<bigint>, options?: SortOptions<bigint>): Set<bigint>;
export function sortNumerics(item: readonly number[], options?: SortOptions<number>): number[];
export function sortNumerics(item: Set<number>, options?: SortOptions<number>): Set<number>;
export function sortNumerics(item: readonly (bigint | number)[], options?: SortOptions<bigint | number>): (bigint | number)[];
export function sortNumerics(item: Set<bigint | number>, options?: SortOptions<bigint | number>): Set<bigint | number>;
export function sortNumerics(item: (readonly (bigint | number)[]) | Set<bigint | number>, options: SortOptions<bigint | number> = {}): (bigint | number)[] | Set<bigint | number> {
	if (item instanceof Set) {
		return new Set<bigint | number>(sortNumericsInternal(Array.from(item.values()), options));
	}
	return sortNumericsInternal(item, options);
}
export default sortNumerics;
export function sortNumericsGeneric<T extends bigint | number>(item: readonly T[], options?: SortOptions<T>): T[];
export function sortNumericsGeneric<T extends bigint | number>(item: Set<T>, options?: SortOptions<T>): Set<T>;
export function sortNumericsGeneric<T extends bigint | number>(item: (readonly T[]) | Set<T>, options: SortOptions<T> = {}): T[] | Set<T> {
	//@ts-ignore Overloads.
	return sortNumerics(item, options);
}
