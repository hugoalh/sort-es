# Sort (ES)

[**⚖️** MIT](./LICENSE.md)

🔗
[GitHub](https://github.com/hugoalh/sort-es)
[JSR](https://jsr.io/@hugoalh/sort)
[NPM](https://www.npmjs.com/package/@hugoalh/sort)

An ECMAScript module for enhanced sort operation.

## 🎯 Targets

| **Runtime \\ Source** | **GitHub Raw** | **JSR** | **NPM** |
|:--|:-:|:-:|:-:|
| **[Bun](https://bun.sh/)** >= v1.1.0 | ❌ | ✔️ | ✔️ |
| **[Deno](https://deno.land/)** >= v2.1.0 | ✔️ | ✔️ | ✔️ |
| **[NodeJS](https://nodejs.org/)** >= v20.9.0 | ❌ | ✔️ | ✔️ |

## 🛡️ Runtime Permissions

This does not request any runtime permission.

## #️⃣ Sources

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

> [!NOTE]
> - It is recommended to include tag for immutability.
> - These are not part of the public APIs hence should not be used:
>   - Benchmark/Test file (e.g.: `example.bench.ts`, `example.test.ts`).
>   - Entrypoint name or path include any underscore prefix (e.g.: `_example.ts`, `foo/_example.ts`).
>   - Identifier/Namespace/Symbol include any underscore prefix (e.g.: `_example`, `Foo._example`).

## ⤵️ Entrypoints

| **Name** | **Path** | **Description** |
|:--|:--|:--|
| `.` | `./mod.ts` | Default. |

## 🧩 APIs

- ```ts
  function sortCollection<K, V>(collection: Map<K, V>, selector: SortCollectionSelector<K, V>, options?: SortCollectionOptions<K>): Map<K, V>;
  function sortCollection<K extends string, V>(collection: Record<K, V>, selector: SortCollectionSelector<K, V>, options?: SortCollectionOptions<K>): Record<K, V>;
  ```
- ```ts
  function sortCollectionByKeys<K extends SortableType, V>(collection: Map<K, V>, options?: SortCollectionOptions<K>): Map<K, V>;
  function sortCollectionByKeys<K extends string, V>(collection: Record<K, V>, options?: SortCollectionOptions<K>): Record<K, V>;
  ```
- ```ts
  function sortCollectionByValues<K, V extends SortableType>(collection: Map<K, V>, options?: SortCollectionOptions<K>): Map<K, V>;
  function sortCollectionByValues<K extends string, V extends SortableType>(collection: Record<K, V>, options?: SortCollectionOptions<K>): Record<K, V>;
  ```
- ```ts
  function sortElements<T extends SortableType>(elements: readonly T[] | Iterable<T>, options?: SortElementsOptions<T>): T[];
  function sortElements<T extends SortableType>(elements: Set<T>, options?: SortElementsOptions<T>): Set<T>;
  function sortElements<T>(elements: readonly T[] | Iterable<T>, selector: SortElementsSelector<T>, options?: SortElementsOptions<T>): T[];
  function sortElements<T>(elements: Set<T>, selector: SortElementsSelector<T>, options?: SortElementsOptions<T>): Set<T>;
  ```
- ```ts
  type SortableType =
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
