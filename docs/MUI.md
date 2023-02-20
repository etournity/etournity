# Material UI

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
- BoxShadows WIP

## Guidelines

- [makeStyle Hook](https://mui.com/system/styles/api/#makestyles-styles-options-hook) instead of [SX prop](https://mui.com/system/the-sx-prop/#main-content) to keep it cleaner
- Layout
  - Use the [Box Component](https://mui.com/components/box/#main-content) from MUI and use it for layouts with [Flexbox](https://mui.com/system/flexbox/#main-content)
  - Use Flexbox on Box components via classes in separate [scss modules](https://mui.com/material-ui/guides/interoperability/#css-modules)
- Use the standard MUI components and customize them if needed with preferably a separate style sheet or the makeStyles Hook
