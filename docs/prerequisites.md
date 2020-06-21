# Prerequisites

Aesthetic is written in Typescript and compiled to JavaScript. As such, all tooling requires at
minimum NodeJS v10.10 to run correctly.

We highly suggest installing and managing NodeJS with [nvm](https://github.com/nvm-sh/nvm).

## Command line

Aesthetic provides an interactive command line program through the `@aesthetic/cli` package. In
furthur documentation, we'll use the `aesthetic` binary within examples, which should be substituted
with 1 of the following patterns.

### Global install

Install the package globally to make the `aesthetic` binary available everywhere.

```bash
# NPM
npm install -g @aesthetic/cli

# Yarn
yarn global add @aesthetic/cli
```

Then run the binary as-is.

```bash
aesthetic <cmd>
```

### Local install

Install the package locally to the project to make the `aesthetic` binary available within scripts.

```bash
# NPM
npm install --save-dev @aesthetic/cli

# Yarn
yarn add --dev @aesthetic/cli
```

Update `package.json` to define the script.

```json
{
  "scripts": {
    "compile": "aesthetic compile <name> ./build"
  }
}
```

Then run the script with NPM or Yarn.

```bash
# NPM
npm run compile

# Yarn
yarn run compile
```

### NPX

Execute a one-off command using [NPX](https://www.npmjs.com/package/npx), which is installed
alongside Node.js and NPM.

```bash
npx @aesthetic/cli <cmd>
```
