import { assertEquals } from "STD/assert/equals";
import { sortElements } from "./elements.ts";
Deno.test("BigInts Normal 1", { permissions: "none" }, () => {
	assertEquals(sortElements([1n, 2n, 3n, 4n, 5n]), [1n, 2n, 3n, 4n, 5n]);
});
Deno.test("BigInts Normal 2", { permissions: "none" }, () => {
	assertEquals(sortElements([3n, 2n, 1n, 4n, 5n]), [1n, 2n, 3n, 4n, 5n]);
});
Deno.test("BigInts Normal 3", { permissions: "none" }, () => {
	assertEquals(sortElements([3n, 1n, 2n, 4n, 5n]), [1n, 2n, 3n, 4n, 5n]);
});
Deno.test("BigInts Special 1", { permissions: "none" }, () => {
	assertEquals(sortElements([1n, 2n, 3n, 4n, 5n], { specialElements: [3n] }), [3n, 1n, 2n, 4n, 5n]);
});
Deno.test("Numbers Normal 1", { permissions: "none" }, () => {
	assertEquals(sortElements([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
});
Deno.test("Numbers Normal 2", { permissions: "none" }, () => {
	assertEquals(sortElements([3, 2, 1, 4, 5]), [1, 2, 3, 4, 5]);
});
Deno.test("Numbers Normal 3", { permissions: "none" }, () => {
	assertEquals(sortElements([3, 1, 2, 4, 5]), [1, 2, 3, 4, 5]);
});
Deno.test("Numbers Special 1", { permissions: "none" }, () => {
	assertEquals(sortElements([1, 2, 3, 4, 5], { specialElements: [3] }), [3, 1, 2, 4, 5]);
});
Deno.test("Numerics Normal 1", { permissions: "none" }, () => {
	assertEquals(sortElements([1n, 1.1, 1.2, 2n]), [1n, 1.1, 1.2, 2n]);
});
Deno.test("Numerics Normal 2", { permissions: "none" }, () => {
	assertEquals(sortElements([1n, 2n, 2]), [1n, 2n, 2]);
});
Deno.test("Numerics Normal 3", { permissions: "none" }, () => {
	assertEquals(sortElements([1n, 2, 2n]), [1n, 2, 2n]);
});
Deno.test("Numerics Normal 4", { permissions: "none" }, () => {
	assertEquals(sortElements([1.1, 1.2, 1n, 0]), [0, 1n, 1.1, 1.2]);
});
Deno.test("Strings Smart 1", { permissions: "none" }, () => {
	assertEquals(sortElements(["11n", "22n", "3n", "4n", "5n"], { smartNumeric: true }), ["3n", "4n", "5n", "11n", "22n"]);
});
Deno.test("Strings Smart 2", { permissions: "none" }, () => {
	assertEquals(sortElements(["101n", "22", "3n", "4n", "5n"], { smartNumeric: true }), ["3n", "4n", "5n", "22", "101n"]);
});
Deno.test("Strings Smart 3", { permissions: "none" }, () => {
	const sample3 = ["sample10.png", "sample3.png", "sample2.png", "sample5.png", "sample4.png"];
	assertEquals(sortElements(sample3), ["sample10.png", "sample2.png", "sample3.png", "sample4.png", "sample5.png"]);
	assertEquals(sortElements(sample3, { smartNumeric: true }), ["sample2.png", "sample3.png", "sample4.png", "sample5.png", "sample10.png"]);
});
