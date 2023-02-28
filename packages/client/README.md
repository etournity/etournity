<div align="center">

# Client

Back to root [README](../../README.md).

</div>
<br/>

## Index

- [Aliases](#aliases)
- [CSS Modules](#css-modules)
- [Material UI](#material-ui)
- [Building Components](#building-components)

# Aliases

Our Frontend has a number of useful aliases for importing frequently used folders:

```bash
@app          -> ./
@components   -> ./components
@handlers     -> ./handlers
@pages        -> ./pages
@utils        -> ./utils
@hooks        -> ./hooks
@state        -> ./state

@style        -> ./style
@generated    -> ./generated
@public       -> ./public
@iconLib      -> ./public/assets/icons/iconLib
```

## Usage

```ts
import SomeComponent from "@components/some-component";
import { parseJWT } from "@utils/cookies";
import { User } from "@generated/graphql";
```

## Adding Aliases

When adding new aliases, remember to add them in here and in `packages/client/tsconfig.json`

<br/>

# CSS Modules

## Introduction

CSS Modules enable us to have component specific css without polluting the global css namespace ([more on that here](https://css-tricks.com/css-modules-part-1-need/)).

Our setup supports auto-complete and other IDE features through a typescript plugin ([VSCode users might need to change their settings and use this workspace's tsdk](https://code.visualstudio.com/docs/typescript/typescript-compiling#_using-the-workspace-version-of-typescript)).

**NOTE:** CSS-Modules are only available for files ending in `.module.scss` or `.module.css`

## Example

`MyComponent.module.scss`

```scss
/* you can import our global definitions and */
/* all other files from `src/style` globally  */
.some-class {
  width: 300px;

  :global(.ant-card-body) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
```

`MyComponent.tsx`

```tsx
import React from "react";
import { Card } from "antd";
import styles from "./MyComponent.module.scss";

export const MyComponent: React.FC = () => (
  <Card className={styles["some-class"]}>
    <p>Hi</p>
  </Card>
);
```

<br/>

# Material UI

Our components are based on the Material Design guidelines and are using the Material UI v5 library. ([MUI Documentation](https://mui.com/material-ui/))

## Setup

We work with a custom created theme which is applied to the client and to the admin package.
The client, admin and shared package have MUI installed.
The theme is located in the shared package in the theme folder.

## What we customized and how to use it

- Changed basic theme colors to our specific ones
- Custom colors
  - List of Custom Colors in the 'darkTheme'
  - [Documentation of Adding the Colors](https://mui.com/customization/theming/)
  - Can be applied through the [SX prop](https://mui.com/system/the-sx-prop/#main-content) or by using the [makeStyle Hook](https://mui.com/system/styles/api/#makestyles-styles-options-hook) - makeStyle is the preferred choice for us
- Ususal Spacing as [spacing variables](https://mui.com/system/spacing/#main-content)
- Breakpoints specific to our standards

## Guidelines

- [makeStyle Hook](https://mui.com/system/styles/api/#makestyles-styles-options-hook) instead of [SX prop](https://mui.com/system/the-sx-prop/#main-content) to keep it cleaner
- Layout
  - Use the [Box Component](https://mui.com/components/box/#main-content) from MUI and use it for layouts with [Flexbox](https://mui.com/system/flexbox/#main-content)
  - Use Flexbox on Box components via classes in separate [scss modules](https://mui.com/material-ui/guides/interoperability/#css-modules)
- Use the standard MUI components and customize them if needed with preferably a separate style sheet or the makeStyles Hook

<br/>

# Building Components

When building a component, follow this structure:

<big><pre>
**components**
├── {domain} (e.g: actions, ui, tournament, ...)
├── {component}
│ ├── index.tsx _# React Component_
│ ├── {component}.module.scss _# Component Styling_
</big></pre>

### Note:

- all Component filenames should be lowerCamelCase (e.g: discordLoginButton)

- always export the component as `export default {Component}`

- always export an interface with the Component props

```typescript
export interface ComponentProps {
  propOne: string;
  propTwo: number;
}
```
