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
Deno.test("1 Key", { permissions: "none" }, () => {
	deepStrictEqual(Object.keys(sortCollectionByKeys(sample1)), ["a", "b", "c", "d"]);
});
Deno.test("1 Value", { permissions: "none" }, () => {
	deepStrictEqual(Object.values(sortCollectionByValues(sample1)), ["0bd85eab08e1", "a5e0a18f58f2", "abdc6b784c27", "abee7ff65308"]);
});
