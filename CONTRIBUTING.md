# Contributing

Contributions are always welcome, no matter how large or small!

## Prerequisites

- Node.js >= v12.17 (v14 is preferred)
- NPM >= v6.14
- Yarn >= v1.22

## Setup

On your first checkout of the repository, you'll need to install dependencies and build the
packages. This is necessary for lints and tests since we're using a monorepo structure.

```bash
yarn install
yarn build
```

### How To

### Open development

All development on Aesthetic happens directly on GitHub. Both core team members and external
contributors send pull requests which go through the same review process.

### Branch organization

Submit all changes directly to the `master` branch. We only use separate branches for upcoming
releases / breaking changes, otherwise, everything points to master.

Code that lands in master must be compatible with the latest stable release. It may contain
additional features, but no breaking changes. We should be able to release a new minor version from
the tip of master at any time.

### Semantic versions and changelogs

We utilize [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) (using the
[beemo preset](https://github.com/beemojs/conventional-changelog-beemo)) for consistent
[semantic versioning](https://semver.org/) between package releases. To enforce this standard, all
pull request titles must match the conventional commits preset specification.

### Reporting a bug

Please report bugs using the
[official issue template](https://github.com/aesthetic-suite/framework/issues/new?assignees=&labels=bug&template=bug_report.md&title=),
only after you have previously searched for the issue and found no results. Be sure to be as
descriptive as possible and to include all applicable labels.

The best way to get your bug fixed is to provide a reduced test case. Please provide a public
repository with a runnable example, or a usable code snippet.

### Requesting new functionality

Before requesting new functionality, view the
[roadmap and backlog](https://github.com/aesthetic-suite/framework/blob/master/ROADMAP.md) as your
request may already exist. If it does not exist, submit an
[issue using the official template](https://github.com/aesthetic-suite/framework/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=).
Be sure to be as descriptive as possible and to include all applicable labels.

### Submitting a pull request

We accept pull requests for all bugs, fixes, improvements, and new features. Before submitting a
pull request, be sure your build passes locally using the development workflow below.

## Development workflow

The following commands are available and should be used in your standard development workflow. To
run all at once (excluding formatting), run `yarn run check`.

### Type checking

Type checking is performed by [TypeScript](https://www.typescriptlang.org/) and can be ran with
`yarn type`. We prefer to run this first, as valid typed code results in valid tests and lints.

### Testing

Tests are written with [Jest](https://jestjs.io/) and can be ran with `yarn jest`. For every
function or class, we expect an associated `*.test.ts` test file in the package's tests folder. We
also write unit tests, not integration tests.

Furthermore, we also aim for 98% code coverage for the entire code base. To validate coverage
outside of CI, run `yarn coverage`, then `open ./coverage/lcov-report/index.html`.

### Linting

Linting is performed by [ESLint](https://eslint.org/) and can be ran with `yarn lint`. Most rules
are errors, but those that are warnings should _not_ be fixed, as they are informational. They
primarily denote browser differences and things that should be polyfilled.

### Formatting

Code formatting is performed by [Prettier](https://prettier.io/). We prefer to run Prettier within
our code editors using `format-on-save` functionality. If you do not have this integrated, please
run `yarn format` before committing.
