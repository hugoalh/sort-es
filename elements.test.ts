import { deepStrictEqual } from "node:assert";
import { sortElements } from "./elements.ts";
Deno.test("BigInts 1", { permissions: "none" }, () => {
	deepStrictEqual(sortElements([1n, 2n, 3n, 4n, 5n]), [1n, 2n, 3n, 4n, 5n]);
});
Deno.test("BigInts 2", { permissions: "none" }, () => {
	deepStrictEqual(sortElements([3n, 2n, 1n, 4n, 5n]), [1n, 2n, 3n, 4n, 5n]);
});
Deno.test("BigInts 3", { permissions: "none" }, () => {
	deepStrictEqual(sortElements([3n, 1n, 2n, 4n, 5n]), [1n, 2n, 3n, 4n, 5n]);
});
Deno.test("Numbers 1", { permissions: "none" }, () => {
	deepStrictEqual(sortElements([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
});
Deno.test("Numbers 2", { permissions: "none" }, () => {
	deepStrictEqual(sortElements([3, 2, 1, 4, 5]), [1, 2, 3, 4, 5]);
});
Deno.test("Numbers 3", { permissions: "none" }, () => {
	deepStrictEqual(sortElements([3, 1, 2, 4, 5]), [1, 2, 3, 4, 5]);
});
Deno.test("Numerics 1", { permissions: "none" }, () => {
	deepStrictEqual(sortElements([1n, 1.1, 1.2, 2n]), [1n, 1.1, 1.2, 2n]);
});
Deno.test("Numerics 2", { permissions: "none" }, () => {
	deepStrictEqual(sortElements([1n, 2n, 2]), [1n, 2n, 2]);
});
Deno.test("Numerics 3", { permissions: "none" }, () => {
	deepStrictEqual(sortElements([1n, 2, 2n]), [1n, 2, 2n]);
});
Deno.test("Numerics 4", { permissions: "none" }, () => {
	deepStrictEqual(sortElements([1.1, 1.2, 1n, 0]), [0, 1n, 1.1, 1.2]);
});
Deno.test("Strings 1", { permissions: "none" }, () => {
	deepStrictEqual(sortElements(["11n", "22n", "3n", "4n", "5n"]), ["3n", "4n", "5n", "11n", "22n"]);
});
Deno.test("Strings 2", { permissions: "none" }, () => {
	deepStrictEqual(sortElements(["101n", "22", "3n", "4n", "5n"]), ["3n", "4n", "5n", "22", "101n"]);
});
Deno.test("Strings 3", { permissions: "none" }, () => {
	const sample3 = ["sample10.png", "sample3.png", "sample2.png", "sample5.png", "sample4.png"];
	deepStrictEqual(sortElements(sample3), ["sample2.png", "sample3.png", "sample4.png", "sample5.png", "sample10.png"]);
	deepStrictEqual(sortElements(sample3, { smartNumeric: false }), ["sample10.png", "sample2.png", "sample3.png", "sample4.png", "sample5.png"]);
});
