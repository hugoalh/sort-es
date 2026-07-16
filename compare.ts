function reverseOrderIndicator(n: number): number {
	return ((n === 0) ? 0 : -n);
}
/**
 * Compare big integers in ascending order, compatible for `Array.prototype.sort`.
 * @param {bigint} a The first big integer for comparison.
 * @param {bigint} b The second big integer for comparison.
 * @returns {number} Order indicator.
 */
export function compareNumericsAscending(a: bigint, b: bigint): number;
/**
 * Compare numbers in ascending order, compatible for `Array.prototype.sort`.
 * @param {number} a The first number for comparison.
 * @param {number} b The second number for comparison.
 * @returns {number} Order indicator.
 */
export function compareNumericsAscending(a: number, b: number): number;
/**
 * Compare `Date`s in ascending order, compatible for `Array.prototype.sort`.
 * @param {Date} a The first `Date` for comparison.
 * @param {Date} b The second `Date` for comparison.
 * @returns {number} Order indicator.
 */
export function compareNumericsAscending(a: Date, b: Date): number;
export function compareNumericsAscending(a: bigint | number | Date, b: bigint | number | Date): number {
	if (a < b) {
		return -1;
	}
	if (a > b) {
		return 1;
	}
	return 0;
}
/**
 * Compare big integers in descending order, compatible for `Array.prototype.sort`.
 * @param {bigint} a The first big integer for comparison.
 * @param {bigint} b The second big integer for comparison.
 * @returns {number} Order indicator.
 */
export function compareNumericsDescending(a: bigint, b: bigint): number;
/**
 * Compare numbers in descending order, compatible for `Array.prototype.sort`.
 * @param {number} a The first number for comparison.
 * @param {number} b The second number for comparison.
 * @returns {number} Order indicator.
 */
export function compareNumericsDescending(a: number, b: number): number;
/**
 * Compare `Date`s in descending order, compatible for `Array.prototype.sort`.
 * @param {Date} a The first `Date` for comparison.
 * @param {Date} b The second `Date` for comparison.
 * @returns {number} Order indicator.
 */
export function compareNumericsDescending(a: Date, b: Date): number;
export function compareNumericsDescending(a: bigint | number | Date, b: bigint | number | Date): number {
	//@ts-ignore Overload.
	return reverseOrderIndicator(compareNumericsAscending(a, b));
}
function dissectStringNumeric(item: string): readonly (bigint | string)[] {
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
export type ComparableType =
	| bigint
	| number
	| string
	| Date;
export interface ComparerOptions {
	/**
	 * Whether to enable language sensitive string comparison.
	 */
	intl?: Intl.Collator;
	/**
	 * Whether to correctly handle numerics for the element with type of string, sort by mathematics instead of ASCII code.
	 * @default {true}
	 */
	smartNumeric?: boolean;
}
export class Comparer {
	#intl?: Intl.Collator;
	#smartNumeric: boolean;
	constructor(options: ComparerOptions = {}) {
		const {
			intl,
			smartNumeric = true
		}: ComparerOptions = options;
		this.#intl = intl;
		this.#smartNumeric = smartNumeric;
	}
	/**
	 * Compare items in ascending order, compatible for `Array.prototype.sort`.
	 * @param {ComparableType} a The first item for comparison.
	 * @param {ComparableType} b The second item for comparison.
	 * @returns {number} Order indicator.
	 */
	compareAscending(a: ComparableType, b: ComparableType): number {
		if (a === b) {
			return 0;
		}
		if (
			(typeof a === "bigint" && typeof b === "bigint") ||
			(typeof a === "number" && typeof b === "number") ||
			(a instanceof Date && b instanceof Date)
		) {
			//@ts-ignore Overload.
			return compareNumericsAscending(a, b);
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
			try {
				return compareNumericsAscending(Number(a), Number(b));
			} catch {
				// CONTINUE
			}
		}
		if (typeof a === "string" && typeof b === "string") {
			if (this.#smartNumeric) {
				const aParts: readonly (bigint | string)[] = dissectStringNumeric(a);
				const bParts: readonly (bigint | string)[] = dissectStringNumeric(b);
				const partsMaximum: number = Math.max(aParts.length, bParts.length);
				for (let index: number = 0; index < partsMaximum; index += 1) {
					const aPart: bigint | string | undefined = aParts.at(index);
					const bPart: bigint | string | undefined = bParts.at(index);
					//deno-lint-ignore hugoalh/no-useless-else -- For visual logic.
					if (typeof aPart === "undefined") {
						if (typeof bPart === "undefined") {
							break;
						}
						return -1;
					} else {
						if (typeof bPart === "undefined") {
							return 1;
						}
						// CONTINUE
					}
					if (aPart === bPart) {
						continue;
					}
					if (typeof aPart === "bigint" && typeof bPart === "bigint") {
						return compareNumericsAscending(aPart, bPart);
					}
					const aPartRaw: string = String(aPart);
					const bPartRaw: string = String(bPart);
					return (this.#intl?.compare(aPartRaw, bPartRaw) ?? (([aPartRaw, bPartRaw].sort()[0] === aPartRaw) ? -1 : 1));
				}
				return 0;
			}
			return (this.#intl?.compare(a, b) ?? (([a, b].sort()[0] === a) ? -1 : 1));
		}
		if (String(a) === String(b)) {
			return 0;
		}
		return (([a, b].sort()[0] === a) ? -1 : 1);
	}
	/**
	 * Compare items in descending order, compatible for `Array.prototype.sort`.
	 * @param {ComparableType} a The first item for comparison.
	 * @param {ComparableType} b The second item for comparison.
	 * @returns {number} Order indicator.
	 */
	compareDescending(a: ComparableType, b: ComparableType): number {
		return reverseOrderIndicator(this.compareAscending(a, b));
	}
}
