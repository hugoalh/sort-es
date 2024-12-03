import { assertEquals } from "STD/assert/equals";
import { sortStrings } from "./strings.ts";
Deno.test("Numeric 1", { permissions: "none" }, () => {
	assertEquals(sortStrings(["11n", "22n", "3n", "4n", "5n"], { smartNumeric: true }), ["3n", "4n", "5n", "11n", "22n"]);
});
Deno.test("Numeric 2", { permissions: "none" }, () => {
	assertEquals(sortStrings(["101n", "22n", "3n", "4n", "5n"], { smartNumeric: true }), ["3n", "4n", "5n", "22n", "101n"]);
});
Deno.test("Numeric 3", { permissions: "none" }, () => {
	const sample3 = ["sample10.png", "sample3.png", "sample2.png", "sample5.png", "sample4.png"];
	assertEquals(sortStrings(sample3), ["sample10.png", "sample2.png", "sample3.png", "sample4.png", "sample5.png"]);
	assertEquals(sortStrings(sample3, { smartNumeric: true }), ["sample2.png", "sample3.png", "sample4.png", "sample5.png", "sample10.png"]);
});
