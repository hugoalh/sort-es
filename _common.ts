export type SortableType =
	| bigint
	| number
	| string
	| Date;
export type SortOrder =
	| "ascending"
	| "descending"
	| "keep";
const sortOrders: readonly SortOrder[] = [
	"ascending",
	"descending",
	"keep"
];
export interface SortOptions {
	/**
	 * Which order the rest elements should use to sort.
	 * @default {"ascending"}
	 */
	restOrder?: SortOrder;
	/**
	 * Whether the rest elements should place first than the special elements.
	 * @default {false}
	 */
	restPlaceFirst?: boolean;
	/**
	 * Whether to correctly handle numerics for the element with type of string, sort by mathematics instead of ASCII code.
	 * @default {true}
	 */
	smartNumeric?: boolean;
	/**
	 * Which order the special elements should use to sort.
	 * @default {"keep"}
	 */
	specialOrder?: SortOrder;
}
export interface PartitionResult<T> {
	rests: T;
	specials: T;
}
function compareNumerics(a: bigint, b: bigint): number;
function compareNumerics(a: number, b: number): number;
function compareNumerics(a: Date, b: Date): number;
function compareNumerics(a: bigint | number | Date, b: bigint | number | Date): number {
	if (a < b) {
		return -1;
	}
	if (a > b) {
		return 1;
	}
	return 0;
}
function dissectStringNumeric(item: string): (bigint | string)[] {
	const result: (bigint | string)[] = [];
	let index: number = 0;
	for (const match of item.matchAll(/\d+/g)) {
		if (index < match.index) {
			result.push(item.slice(index, match.index));
		}
		result.push(BigInt(match[0]));
		index = match.index + match[0].length;
	}
	result.push(item.slice(index, item.length));
	return result;
}
export interface SorterContext<T> {
	original: T;
	select: SortableType;
}
export interface SorterOptions extends Pick<SortOptions, "smartNumeric"> {
	order?: SortOrder;
}
export function sorter<T>(contexts: readonly SorterContext<T>[], options: SorterOptions = {}): T[] {
	const {
		order = "ascending",
		smartNumeric = true
	}: SorterOptions = options;
	if (!sortOrders.includes(order)) {
		throw new RangeError(`\`${order}\` is not a valid sort order! Only accept these values: ${sortOrders.join(", ")}`);
	}
	if (order === "keep") {
		return contexts.map(({ original }: SorterContext<T>): T => {
			return original;
		});
	}
	const result: T[] = contexts.toSorted(({ select: a }: SorterContext<T>, { select: b }: SorterContext<T>): number => {
		if (a === b) {
			return 0;
		}
		if (typeof a === "bigint" && typeof b === "bigint") {
			return compareNumerics(a, b);
		}
		if (typeof a === "number" && typeof b === "number") {
			return compareNumerics(a, b);
		}
		if (a instanceof Date && b instanceof Date) {
			return compareNumerics(a, b);
		}
		if (
			(
				typeof a === "bigint" ||
				typeof a === "number" ||
				a instanceof Date
			) && (
				typeof b === "bigint" ||
				typeof b === "number" ||
				b instanceof Date
			)
		) {
			return compareNumerics(Number(a), Number(b));
		}
		if (typeof a === "string" && typeof b === "string" && smartNumeric) {
			const aParts: readonly (bigint | string)[] = dissectStringNumeric(a);
			const bParts: readonly (bigint | string)[] = dissectStringNumeric(b);
			const partsMaximum: number = Math.max(aParts.length, bParts.length);
			for (let index: number = 0; index < partsMaximum; index += 1) {
				const aPart: bigint | string | undefined = aParts[index];
				const bPart: bigint | string | undefined = bParts[index];
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
		}
		if (String(a) === String(b)) {
			return 0;
		}
		return (([a, b].sort()[0] === a) ? -1 : 1);
	}).map(({ original }: SorterContext<T>): T => {
		return original;
	});
	return ((order === "descending") ? result.reverse() : result);
}
