# Aesthetic

Aesthetic is an end-to-end design and development framework for declaring consistent visual styles
across platforms, languages, projects, and teams.

The entry point to Aesthetic is a fixed [design system](./design.md), created and
[configured in YAML](./design/config.md). This design system is then
[compiled to design tokens](./tokens.md) for a target platform (Android, iOS, and Web) and format
(CSS, SCSS, etc). With this, all platforms are supported, across many languages and technologies,
with the design system configuration being the single shared source of truth.

Furthermore, the design system isn't the only feature that Aesthetic provides. It also provides a
framework-agnostic CSS-in-JS solution, built around the design system itself. This solution provides
a highly performant and ergonomic API for styling web components.

## For designers

As a designer, you own the design system, its aspects, and its themes, by managing the YAML
configuration file. In the future, this YAML file will be automatically exported from a Figma file,
or additional upstream sources.

- [Create a design system](./design/create.md)
- [Configure the design system](./design/config.md)

## For developers

As a developer, you compile the design system configuration into design tokens for one or many
platform targets. These design tokens can then be used to style your website or components.

- [Compile design tokens](./tokens/compile.md)
- [Style components](./tokens/styles.md)

## Motivation and goals

**Designers must be able to contribute.** To support this, the design system is configured in YAML,
which is easy to learn, read, and write, and works across all operating systems and languages.

**Configuration _and_ convention.** YAML configuration will allow for explicit customization if
needed, otherwise the automated settings will suffice as the common denominator. Ultimately,
regardless of which approach is chosen, it will be compiled down to the same design tokens.

**Mobile first _or_ desktop first.** Regardless of what device is being targeted, responsive and
adaptive support will be baked into the system, with utilities to effortlessly integrate it.

**Multiple design systems can be used in parallel.** Through themes, this allows for a migration
between old and new designs (2019 vs 2020), without having to modify components or style sheets. For
this to work, the theme needs to be fixed and strict.

**Compatibility with third-party libraries must be seamless.** If a library is written in Aesthetic,
and they use our utilities and theme structure, they immediately gain all the benefits of the design
system.

**Support all platforms.** Why only support web? Let's support Android and iOS as well, so that the
design system is truly universal, and is the single source of truth.

**Support all styling patterns.** Use Sass? Or maybe Less? Or you on the CSS-in-JS train? Either
way, no matter what pattern your application uses (or maybe multiple patterns), the design system
can target all of them.

**Performance is top priority.** Regardless of what platform and target is chosen, performance
overhead should be almost non-existent. Aim for zero or low runtime overhead.

**Developer experience must be enjoyable.** Ideally, all Aesthetic APIs and systems are easy to use,
easy to learn, and ultimately enjoyable to integrate.

**Testing is an after-thought.** When testing styled components, it will just work. No extra
overhead or DOM requirements are necessary. Will also be easy to test class name and style changes
based on props.

**User preference matters.** Does the user prefer dark color schemes? Low contrast colors? Reduced
motion? The framework will take all this into account, throughout all aspects of the framework.
