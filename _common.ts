import {
	Comparer,
	type ComparableType,
	type ComparerOptions
} from "./compare.ts";
export type SortOrder =
	| "ascending"
	| "descending"
	| "keep";
const sortOrders: readonly SortOrder[] = [/* UNIQUE */
	"ascending",
	"descending",
	"keep"
];
export interface SortOptions extends ComparerOptions {
	/**
	 * Which order should use to sort.
	 * @default {"ascending"}
	 */
	order?: SortOrder;
}
export interface SortContext<T> {
	original: T;
	select: ComparableType;
}
export function sorter<T>(contexts: readonly SortContext<T>[], options: SortOptions = {}): T[] {
	const { order = "ascending" }: SortOptions = options;
	if (!sortOrders.includes(order)) {
		throw new RangeError(`\`${order}\` is not a valid sort order! Only accept these values: ${sortOrders.join(", ")}`);
	}
	if (order === "keep") {
		return contexts.map(({ original }: SortContext<T>): T => {
			return original;
		});
	}
	const comparer: Comparer = new Comparer(options);
	const result: T[] = contexts.toSorted(({ select: a }: SortContext<T>, { select: b }: SortContext<T>): number => {
		return comparer.compareAscending(a, b);
	}).map(({ original }: SortContext<T>): T => {
		return original;
	});
	return ((order === "descending") ? result.reverse() : result);
}
