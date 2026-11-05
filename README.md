# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.


#### add shadcn/ui

```
npx shadcn@latest add select
```

### Managing tools

Tool names, descriptions, categories, routes, and search tags live in
`src/data/tools.ts`. The Tools directory and individual page headings use this
registry. `pageTitle` and `pageDescription` are optional overrides for localized
page copy; omit them to use the directory name and description.

To add a tool:

1. Add an entry to `toolDefinitions` in `src/data/tools.ts`, using a unique ID
   and the matching `/tools/<id>` route.
2. Create `src/pages/tools/<id>.tsx` and wrap its content in
   `<ToolLayout toolId="<id>">...</ToolLayout>`.
3. Run `npm run check:tools` and `npm run typecheck`.

`npm run build` also runs the registry check automatically. It checks for
missing or unregistered pages, duplicate IDs/routes, and mismatched layout IDs.
