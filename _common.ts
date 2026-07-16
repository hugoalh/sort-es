import {
	Comparer,
	type ComparableType,
	type ComparerOptions
} from "./compare.ts";
export interface SortOptions extends ComparerOptions {
	/**
	 * Whether to sort in descending order instead of ascending order.
	 * @default {false}
	 */
	descending?: boolean;
}
export interface SortContext<T> {
	original: T;
	select: ComparableType;
}
export function sorter<T>(contexts: readonly SortContext<T>[], options: SortOptions = {}): T[] {
	const { descending = false }: SortOptions = options;
	const comparer: Comparer = new Comparer(options);
	const result: T[] = contexts.toSorted(({ select: a }: SortContext<T>, { select: b }: SortContext<T>): number => {
		return comparer.compareAscending(a, b);
	}).map(({ original }: SortContext<T>): T => {
		return original;
	});
	return (descending ? result.reverse() : result);
}
