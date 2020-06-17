# Create a design system

Aesthetic itself isn't a design system, instead, it provides a design system "builder", in which a
company or individual can create and manage a design system for their project. To create a design
system, run the following command in your project root.

```
npx @aesthetic/cli init
```

This command will generate an [YAML configuration file](./config-system.md) in which you may
customize all aspects of the system. By default, the `init` command will generate the configuration
using fixed settings. If you would prefer to use scaled settings (using
[modular scale](./config-system.md#scaling-patterns)), pass the `--modularScale` flag.

```
npx @aesthetic/cli init --modularScale
```

Furthermore, if you would prefer to create the configuration file in another location, you can pass
a relative folder path as an argument. This may be useful for supporting multiple design systems.
However, be aware that the file name is the same, and as such, you may run into overwrites or
collisions.

```
npx @aesthetic/cli init ./design-systems/2020
```

## References

- [Basics - Design system](./basics/design-system.md)
