import { deepStrictEqual } from "node:assert";
import {
	sortCollectionByKeys,
	sortCollectionByValues
} from "./collection.ts";
const sample1 = {
	d: "0bd85eab08e1",
	b: "abdc6b784c27",
	c: "a5e0a18f58f2",
	a: "abee7ff65308"
};
Deno.test("1 Key Normal", { permissions: "none" }, () => {
	const result = Object.keys(sortCollectionByKeys(sample1));
	deepStrictEqual(result, ["a", "b", "c", "d"]);
});
Deno.test("1 Key Special", { permissions: "none" }, () => {
	const result = Object.keys(sortCollectionByKeys(sample1, {
		specialEntriesKey: ["c"]
	}));
	deepStrictEqual(result, ["c", "a", "b", "d"]);
});
Deno.test("1 Key RestFirst Special", { permissions: "none" }, () => {
	const result = Object.keys(sortCollectionByKeys(sample1, {
		specialEntriesKey: ["c"],
		restPlaceFirst: true
	}));
	deepStrictEqual(result, ["a", "b", "d", "c"]);
});
Deno.test("1 Value", { permissions: "none" }, () => {
	const result = Object.values(sortCollectionByValues(sample1));
	deepStrictEqual(result, ["0bd85eab08e1", "a5e0a18f58f2", "abdc6b784c27", "abee7ff65308"]);
});
