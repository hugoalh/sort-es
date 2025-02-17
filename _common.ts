export type SortableType = bigint | number | string;
export type SortElementsSelector<T> = (element: T) => SortableType;
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
	 * @default {false}
	 */
	smartNumeric?: boolean;
}
function compareNumerics(a: bigint, b: bigint): number;
function compareNumerics(a: number, b: number): number;
function compareNumerics(a: bigint | number, b: bigint | number): number {
	if (a < b) {
		return -1;
	}
	if (a > b) {
		return 1;
	}
	return 0;
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
function resolveSortOrder(input: SortOrder): SortOrder {
	const result: SortOrder | undefined = sortOrders[input];
	if (typeof result === "undefined") {
		throw new RangeError(`\`${input}\` is not a valid sort order! Only accept these values: ${Object.keys(sortOrders).sort().join(", ")}`);
	}
	return result;
}
export function sort<T extends SortableType>(elements: readonly T[], options: Pick<SortOptions, "restOrder" | "smartNumeric">): T[] {
	const {
		restOrder: order = "ascending",
		smartNumeric = false
	}: Pick<SortOptions, "restOrder" | "smartNumeric"> = options;
	const orderFmt: SortOrder = resolveSortOrder(order);
	const result: T[] = [...elements];
	if (orderFmt !== "keep") {
		result.sort((a: T, b: T): number => {
			if (a === b) {
				return 0;
			}
			if (typeof a === "bigint" && typeof b === "bigint") {
				return compareNumerics(a, b);
			}
			if (typeof a === "number" && typeof b === "number") {
				return compareNumerics(a, b);
			}
			if (
				(
					typeof a === "bigint" ||
					typeof a === "number"
				) && (
					typeof b === "bigint" ||
					typeof b === "number"
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
		});
		if (orderFmt === "descending") {
			result.reverse();
		}
	}
	return result;
}
