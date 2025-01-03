import { assertEquals } from "STD/assert/equals";
import { sortNumerics } from "./numerics.ts";
Deno.test("BigInt Normal 1", { permissions: "none" }, () => {
	assertEquals(sortNumerics([1n, 2n, 3n, 4n, 5n]), [1n, 2n, 3n, 4n, 5n]);
});
Deno.test("BigInt Normal 2", { permissions: "none" }, () => {
	assertEquals(sortNumerics([3n, 2n, 1n, 4n, 5n]), [1n, 2n, 3n, 4n, 5n]);
});
Deno.test("BigInt Normal 3", { permissions: "none" }, () => {
	assertEquals(sortNumerics([3n, 1n, 2n, 4n, 5n]), [1n, 2n, 3n, 4n, 5n]);
});
Deno.test("BigInt Special 1", { permissions: "none" }, () => {
	assertEquals(sortNumerics([1n, 2n, 3n, 4n, 5n], { specials: [3n] }), [3n, 1n, 2n, 4n, 5n]);
});
Deno.test("Number Normal 1", { permissions: "none" }, () => {
	assertEquals(sortNumerics([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
});
Deno.test("Number Normal 2", { permissions: "none" }, () => {
	assertEquals(sortNumerics([3, 2, 1, 4, 5]), [1, 2, 3, 4, 5]);
});
Deno.test("Number Normal 3", { permissions: "none" }, () => {
	assertEquals(sortNumerics([3, 1, 2, 4, 5]), [1, 2, 3, 4, 5]);
});
Deno.test("Number Special 1", { permissions: "none" }, () => {
	assertEquals(sortNumerics([1, 2, 3, 4, 5], { specials: [3] }), [3, 1, 2, 4, 5]);
});
Deno.test("Mix Normal 1", { permissions: "none" }, () => {
	assertEquals(sortNumerics([1n, 1.1, 1.2, 2n]), [1n, 1.1, 1.2, 2n]);
});
Deno.test("Mix Normal 2", { permissions: "none" }, () => {
	assertEquals(sortNumerics([1n, 2n, 2]), [1n, 2n, 2]);
});
Deno.test("Mix Normal 3", { permissions: "none" }, () => {
	assertEquals(sortNumerics([1n, 2, 2n]), [1n, 2, 2n]);
});
Deno.test("Mix Normal 4", { permissions: "none" }, () => {
	assertEquals(sortNumerics([1.1, 1.2, 1n, 0]), [0, 1n, 1.1, 1.2]);
});
