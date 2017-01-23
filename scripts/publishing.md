# Publishing

Since Aesthetic is a combination of Yarn, NPM, and Lerna, publishing can be
quite tricky and problematic. Publishing should *always* be done with NPM
using the following commands.

```
npm version <semver>
npm run publish
```

If Lerna balks with "No updated packages to publish", we need to force publish.

```
npm run publish -- --force-publish *
```
