import { assertEquals } from "STD/assert/equals";
import { sortCollectionByKeys } from "./collection.ts";
const sample1 = {
	d: "0bd85eab08e1",
	b: "abdc6b784c27",
	c: "a5e0a18f58f2",
	a: "abee7ff65308"
};
Deno.test("Normal 1", { permissions: "none" }, () => {
	const result = Object.keys(sortCollectionByKeys(sample1));
	assertEquals(result, ["a", "b", "c", "d"]);
});
Deno.test("Special 1", { permissions: "none" }, () => {
	const result = Object.keys(sortCollectionByKeys(sample1, {
		keysSpecial: ["c"]
	}));
	assertEquals(result, ["c", "a", "b", "d"]);
});
Deno.test("RestFirst Special 1", { permissions: "none" }, () => {
	const result = Object.keys(sortCollectionByKeys(sample1, {
		keysSpecial: ["c"],
		restPlaceFirst: true
	}));
	assertEquals(result, ["a", "b", "d", "c"]);
});
