# Components

## Introduction

After using Antdesign for quite some time, we were hitting more obstacles when it came to customization. Therefore we decided to create our own component library.

To make the communication between design and the dev team easier we are using Storybook.

## Building a Component

Whe building a component, follow this structure:

<big><pre>
**components**
├── {domain} (e.g: actions, ui, tournament, ...)
├── {component}
│ ├── index.tsx _# React Component_
│ ├── {component}.module.scss _# Component Styling_
│ └── {component}.stories.tsx _# Storybook implementation_</big></pre>

### Note:

- all Component filenames should be lowerCamelCase (e.g: discordLoginButton)

- always export the component as `export default {Component}`

- always export an interface with the Component props

```typescript
export interface ComponentProps {
  propOne: string
  propTwo: number
}
```
