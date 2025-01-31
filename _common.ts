export type SortOrder =
	| "ascending"
	| "descending"
	| "keep";
const sortOrders: Readonly<Record<string, SortOrder>> = {
	a: "ascending",
	ascending: "ascending",
	d: "descending",
	descending: "descending",
	k: "keep",
	keep: "keep"
};
export interface SortOptions<T> {
	/**
	 * Which order the rest elements/keys should use to sort.
	 * @default {"ascending"}
	 */
	restOrder?: SortOrder;
	/**
	 * Whether the rest elements/keys should place first than the special elements/keys.
	 * @default {false}
	 */
	restPlaceFirst?: boolean;
	/**
	 * Sort these special elements/keys in this specify order.
	 */
	specials?: readonly T[];
}
export function compareNumerics(a: bigint, b: bigint): number;
export function compareNumerics(a: number, b: number): number;
export function compareNumerics(a: bigint | number, b: bigint | number): number {
	if (a < b) {
		return -1;
	}
	if (a > b) {
		return 1;
	}
	return 0;
}
export function partitionSpecials<T>(item: readonly T[], specials: readonly T[]): [specials: T[], rests: T[]] {
	const partSpecials: T[] = [];
	const partRests: T[] = [];
	for (const element of item) {
		specials.includes(element) ? partSpecials.push(element) : partRests.push(element);
	}
	partSpecials.sort((a: T, b: T): number => {
		return (specials.indexOf(a) - specials.indexOf(b));
	});
	return [partSpecials, partRests];
}
export function resolveSortOrder(input: SortOrder): SortOrder {
	const result: SortOrder | undefined = sortOrders[input];
	if (typeof result === "undefined") {
		throw new RangeError(`\`${input}\` is not a valid sort order! Only accept these values: ${Object.keys(sortOrders).sort().join(", ")}`);
	}
	return result;
}
