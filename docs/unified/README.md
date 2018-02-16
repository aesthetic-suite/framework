# Unified Syntax

Aesthetic provides an optional unified CSS-in-JS syntax. This unified syntax permits
easy [drop-in replacements](https://en.wikipedia.org/wiki/Drop-in_replacement)
between adapters that utilize CSS-in-JS objects, as well as a standard across libraries.

**Pros**
* Easily swap between CSS-in-JS adapters (for either performance or extensibility reasons)
  without having to rewrite all CSS style object syntax.
* Third-party UI libraries can define their styles using the unified syntax,
  while consumers can choose their preferred adapter.
* Third-party UI libraries can standardize on a single syntax for interoperability.
* Only have to learn one form of syntax.

**Cons**
* Slight overhead (like milliseconds) converting the unified syntax to the adapters native
  syntax. However, Aesthetic caches heavily.
* Must learn a new form of syntax (hopefully the last one).

**Why a new syntax?**

While implementing adapters and writing tests for all their syntax and use cases, I noticed
that all adapters shared about 90-95% of the same syntax. That remaining percentage could
easily be abstracted away by a library, and hence, this unified syntax was created.

Furthermore, a unified syntax allows providers of third-party components to define their styles
in a standard way with consumers having the choice of their preferred adapter.

**Why a different at-rule structure?**

The major difference between the unified syntax and native adapters syntax, is that at-rules
in the unified syntax are now multi-dimensional objects indexed by the name of the at-rule
(`@media`), while at-rules in the native syntax are single objects indexed by the at-rule
declaration (`@media (min-width: 100px)`).

Supporting the native syntax incurred an linear (`O(n)`) lookup, as we would have to loop
through each object recursively to find all at-rules, while the unified syntax is a simple
constant (`O(1)`) lookup as we know the names ahead of time. This constant time lookup is
what enables a fast conversion process between the unified and native syntaxes.

**How do I enable the unified syntax?**

Please refer to the readme of your chosen adapter.
