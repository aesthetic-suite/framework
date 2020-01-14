# Aesthetic

Requirements for the design system and framework:

- **Designers must be able to contribute.** To support this, the design system is configured in
  YAML, which is easy to learn and write, and works across all operating systems and languages.
- **Configuration _and_ convention.** YAML configuration will allow for explicit customizability if
  needed, otherwise the automated settings will suffice as the common denominator. Ultimately,
  regardless of which approach is chosen, it will be compiled down to the same design tokens.
- **Mobile first _or_ desktop first.** Regardless of what device is being targeted, responsive and
  adaptive support will be baked into the system, with utilities to effortless integrate it.
- **Multiple design systems can be used in parallel.** Through themes, this allows for a migration
  between old and new designs (2019 vs 2020), without having to modify components or style sheets.
  For this to work, the theme needs to be strict.
- **Interoping with third-party libraries must be seamless.** If a library is written in Aesthetic,
  and they use our utilities and theme structure, they immediately gain all the benefits of the
  design system.
- **Support all platforms.** Why only support web? Let's support Android and iOS also, so that the
  design system is truly universal, and is the source of truth.
- **Support all styling patterns.** Use Sass? Or maybe Less? Or you on the CSS-in-JS train? Either
  way, no matter what pattern your application uses (or maybe multiple patterns), the design system
  can target all of them.
- **Performance is top priority.** Regardless of what platform and target is chosen, performance
  overhead should be almost non-existant. Aim for zero runtime overhead, or as close as possible.
- **Developer experience must be enjoyable.** Ideally, all Aesthetic APIs and systems are easy to
  use, easy to learn, and ultimately enjoyable to integrate.
- **Testing is an after-thought.** When testing styled components, it will just work. No extra
  overhead or DOM requirements are necessary. Will also be easy to test class name and style changes
  based on props.
- **User preference matters.** Does the user prefer dark color schemes? Low contrast colors? Reduced
  motion? The framework will take all this into account, throughout all aspects of the pipeline.
