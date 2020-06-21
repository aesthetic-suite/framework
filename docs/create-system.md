# Create a design system

Aesthetic itself isn't a design system, instead, it provides a design system "manager", in which a
company or individual can create and manage a design system for their project. To create a design
system, run the following [command](./prerequisites.md#command-line) in your project root with a
unique name (in kebab-case).

```bash
aesthetic init dls-2020
```

By default, the `init` command will generate the configuration using fixed settings. If you would
prefer to use scaled settings (using [modular scale](./config/README.md#scaled-patterns)), pass the
`--modularScale` flag.

```bash
aesthetic init dls-2020 --modularScale
```

## Folder structure

The `init` command will create multiple [YAML configuration files](./config/README.md) in an
`.aesthetic` folder within the project root.

```
.aesthetic/dls-2020/
├── brand.yaml
├── language.yaml
└── themes.yaml
```

This `.aesthetic` folder is where all design systems, their configurations, and future features will
be housed.

## References

- [Basics - Design system](./basics/design-system.md)
- [Basics - Themes](./basics/themes.md)
