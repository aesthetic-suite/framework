# Create a design system

Aesthetic itself isn't a design system, instead, it provides a design system "manager", in which a
company or individual can create and manage a design system for their project. To create a design
system, run the `init` [command](../prerequisites.md#command-line) in your project root with a
unique name (in kebab-case).

```bash
aesthetic init <name>
```

By default, the `init` command will generate the configuration using fixed settings. If you would
prefer to use scaled settings (using [modular scale](./config.md#scaled-patterns)), pass the
`--modularScale` flag.

```bash
aesthetic init <name> --modularScale
```

## Folder structure

The `init` command will create multiple [YAML configuration files](./config.md) in an `.aesthetic`
folder within the project root.

```
.aesthetic/<name>/
├── brand.yaml
├── language.yaml
└── themes.yaml
```

This `.aesthetic` folder is where all design systems, their configurations, and future features will
be housed.
