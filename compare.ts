export type ComparableType =
	| bigint
	| number
	| string
	| Date;
function reverseOrderIndicator(n: number): number {
	return ((n === 0) ? 0 : -n);
}
/**
 * Compare big integers in ascending order, compatible for `Array.prototype.sort`.
 * @param {bigint} a The first big integer for comparison.
 * @param {bigint} b The second big integer for comparison.
 * @returns {number} Order indicator.
 */
export function compareBigIntsAscending(a: bigint, b: bigint): number {
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
export function compareBigIntsDescending(a: bigint, b: bigint): number {
	return reverseOrderIndicator(compareBigIntsAscending(a, b));
}
/**
 * Compare `Date`s in ascending order, compatible for `Array.prototype.sort`.
 * @param {Date} a The first `Date` for comparison.
 * @param {Date} b The second `Date` for comparison.
 * @returns {number} Order indicator.
 */
export function compareDatesAscending(a: Date, b: Date): number {
	return compareNumbersAscending(a.getTime(), b.getTime());
}
/**
 * Compare `Date`s in descending order, compatible for `Array.prototype.sort`.
 * @param {Date} a The first `Date` for comparison.
 * @param {Date} b The second `Date` for comparison.
 * @returns {number} Order indicator.
 */
export function compareDatesDescending(a: Date, b: Date): number {
	return reverseOrderIndicator(compareDatesAscending(a, b));
}
/**
 * Compare numbers in ascending order, compatible for `Array.prototype.sort`.
 * @param {number} a The first number for comparison.
 * @param {number} b The second number for comparison.
 * @returns {number} Order indicator.
 */
export function compareNumbersAscending(a: number, b: number): number {
	if (Number.isNaN(a)) {
		return -1;
	}
	if (Number.isNaN(b)) {
		return 1;
	}
	if (a < b) {
		return -1;
	}
	if (a > b) {
		return 1;
	}
	return 0;
}
/**
 * Compare numbers in descending order, compatible for `Array.prototype.sort`.
 * @param {number} a The first number for comparison.
 * @param {number} b The second number for comparison.
 * @returns {number} Order indicator.
 */
export function compareNumbersDescending(a: number, b: number): number {
	return reverseOrderIndicator(compareNumbersAscending(a, b));
}
interface NumericSerialize {
	negative: boolean;
	integer: bigint;
	float: bigint | null;
}
function serializeNumeric(item: Exclude<ComparableType, string>): NumericSerialize | null {
	if (typeof item === "bigint") {
		return {
			negative: item < 0n,
			integer: item,
			float: null
		};
	}
	const value: number = (item instanceof Date) ? item.getTime() : item;
	if (Number.isNaN(value)) {
		return null;
	}
	const valueNegative: boolean = value < 0;
	const valueAbs: number = Math.abs(value);
	const valueInteger: number = Math.floor(valueAbs);
	if (Number.isInteger(valueAbs)) {
		return {
			negative: valueNegative,
			integer: BigInt(valueInteger),
			float: null
		};
	}
	const valueFloatRaw: string = (valueAbs - valueInteger).toFixed(100);
	return {
		negative: valueNegative,
		integer: BigInt(valueInteger),
		float: valueFloatRaw.startsWith("1.") ? BigInt("9".repeat(100)) : BigInt(valueFloatRaw.slice(2))
	};
}
/**
 * Compare numerics in ascending order, compatible for `Array.prototype.sort`.
 * @param {Exclude<ComparableType,string>} a The first numeric for comparison.
 * @param {Exclude<ComparableType,string>} b The second numeric for comparison.
 * @returns {number} Order indicator.
 */
export function compareNumericsAscending(a: Exclude<ComparableType, string>, b: Exclude<ComparableType, string>): number {
	if (Number.isNaN(a)) {
		return -1;
	}
	if (Number.isNaN(b)) {
		return 1;
	}
	if (typeof a === "bigint" && typeof b === "bigint") {
		return compareBigIntsAscending(a, b);
	}
	if (a instanceof Date && b instanceof Date) {
		return compareDatesAscending(a, b);
	}
	if (typeof a === "number" && typeof b === "number") {
		return compareNumbersAscending(a, b);
	}
	const aSerialize: NumericSerialize | null = serializeNumeric(a);
	const bSerialize: NumericSerialize | null = serializeNumeric(b);
	if (aSerialize === null) {
		return -1;
	}
	if (bSerialize === null) {
		return 1;
	}
	if (aSerialize.negative && !bSerialize.negative) {
		return -1;
	}
	if (bSerialize.negative && !aSerialize.negative) {
		return 1;
	}
	if (aSerialize.integer < bSerialize.integer) {
		return -1;
	}
	if (aSerialize.integer > bSerialize.integer) {
		return 1;
	}
	if (aSerialize.float === null && bSerialize.float === null) {
		return 0;
	}
	if (aSerialize.float === null && bSerialize.float !== null) {
		return -1;
	}
	if (bSerialize.float === null && aSerialize.float !== null) {
		return 1;
	}
	return compareBigIntsAscending(aSerialize.float!, bSerialize.float!);
}
/**
 * Compare numerics in descending order, compatible for `Array.prototype.sort`.
 * @param {Exclude<ComparableType,string>} a The first numeric for comparison.
 * @param {Exclude<ComparableType,string>} b The second numeric for comparison.
 * @returns {number} Order indicator.
 */
export function compareNumericsDescending(a: Exclude<ComparableType, string>, b: Exclude<ComparableType, string>): number {
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
	get [Symbol.toStringTag](): string {
		return "Comparer";
	}
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
			return compareNumericsAscending(a, b);
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
						return compareBigIntsAscending(aPart, bPart);
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
