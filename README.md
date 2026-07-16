# Sort (ES)

[**⚖️** MIT](./LICENSE.md)

🔗
[DistBoard @hugoalh](https://hugoalh.github.io/distboard/sort_ecmascript)
● [GitHub](https://github.com/hugoalh/sort-es)
● [JSR](https://jsr.io/@hugoalh/sort)
● [NPM](https://www.npmjs.com/package/@hugoalh/sort)

An ECMAScript module for enhanced sort operation.

## 🎯 Runtime Targets

Any runtime which support ECMAScript should able to use this; These runtimes are officially supported:

- **[Bun](https://bun.sh/)** >= v1.1.0
- **[Deno](https://deno.land/)** >= v2.1.0
- **[NodeJS](https://nodejs.org/)** >= v20.9.0

## 🛡️ Runtime Permissions

This does not request any runtime permission.

## #️⃣ Sources & Entrypoints

- GitHub Raw
  ```
  https://raw.githubusercontent.com/hugoalh/sort-es/{Tag}/mod.ts
  ```
- JSR
  ```
  jsr:@hugoalh/sort[@{Tag}]
  ```
- NPM
  ```
  npm:@hugoalh/sort[@{Tag}]
  ```

| **Name** | **Path** | **Description** |
|:--|:--|:--|
| `.` | `./mod.ts` | Default. |
| `./collection` | `./collection.ts` | Sort collection. |
| `./compare` | `./compare.ts` | Compare. |
| `./elements` | `./elements.ts` | Sort elements. |

> [!NOTE]
> - Different runtimes have vary support for the sources and entrypoints, visit the runtime documentation for more information.
> - It is recommended to include tag for immutability.
> - These are not part of the public APIs hence should not be used:
>   - Benchmark/Test file (e.g.: `example.bench.ts`, `example.test.ts`).
>   - Entrypoint name or path include any underscore prefix (e.g.: `_example.ts`, `foo/_example.ts`).
>   - Identifier/Namespace/Symbol include any underscore prefix (e.g.: `_example`, `Foo._example`).

## 🧩 APIs

- ```ts
  class Comparer {
    constructor(options?: ComparerOptions);
    compareAscending(a: ComparableType, b: ComparableType): number;
    compareDescending(a: ComparableType, b: ComparableType): number;
  }
  ```
- ```ts
  function compareNumericsAscending(a: bigint, b: bigint): number;
  function compareNumericsAscending(a: number, b: number): number;
  function compareNumericsAscending(a: Date, b: Date): number;
  ```
- ```ts
  function compareNumericsDescending(a: bigint, b: bigint): number;
  function compareNumericsDescending(a: number, b: number): number;
  function compareNumericsDescending(a: Date, b: Date): number;
  ```
- ```ts
  function sortCollection<K, V>(collection: Map<K, V>, selector: SortCollectionSelector<K, V>, options?: SortOptions): Map<K, V>;
  function sortCollection<K extends string, V>(collection: Record<K, V>, selector: SortCollectionSelector<K, V>, options?: SortOptions): Record<K, V>;
  ```
- ```ts
  function sortCollectionByKeys<K extends ComparableType, V>(collection: Map<K, V>, options?: SortOptions): Map<K, V>;
  function sortCollectionByKeys<K extends string, V>(collection: Record<K, V>, options?: SortOptions): Record<K, V>;
  ```
- ```ts
  function sortCollectionByValues<K, V extends ComparableType>(collection: Map<K, V>, options?: SortOptions): Map<K, V>;
  function sortCollectionByValues<K extends string, V extends ComparableType>(collection: Record<K, V>, options?: SortOptions): Record<K, V>;
  ```
- ```ts
  function sortElements<T extends ComparableType>(elements: readonly T[] | Iterable<T>, options?: SortOptions): T[];
  function sortElements<T extends ComparableType>(elements: Set<T>, options?: SortOptions): Set<T>;
  function sortElements<T>(elements: readonly T[] | Iterable<T>, selector: SortElementsSelector<T>, options?: SortOptions): T[];
  function sortElements<T>(elements: Set<T>, selector: SortElementsSelector<T>, options?: SortOptions): Set<T>;
  ```
- ```ts
  type ComparableType =
    | bigint
    | number
    | string
    | Date;
  ```

> [!NOTE]
> - For the full or prettier documentation, can visit via:
>   - [Deno CLI `deno doc`](https://docs.deno.com/runtime/reference/cli/doc/)
>   - [JSR](https://jsr.io/@hugoalh/sort)

## ✍️ Examples

- ```ts
  sortElements([1.1, 1.2, 1n, 0]);
  //=> [0, 1n, 1.1, 1.2]
  ```
- ```ts
  sortElements(["sample10.png", "sample3.png", "sample2.png", "sample5.png", "sample4.png"]);
  //=> ["sample2.png", "sample3.png", "sample4.png", "sample5.png", "sample10.png"]
  ```
