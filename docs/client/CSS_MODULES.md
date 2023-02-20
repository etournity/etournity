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
import React from 'react'
import { Card } from 'antd'
import styles from './MyComponent.module.scss'

export const MyComponent: React.FC = () => (
  <Card className={styles['some-class']}>
    <p>Hi</p>
  </Card>
)
```
