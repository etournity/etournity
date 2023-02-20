# Global State

Global state is managed using `mobx-state-tree`.
State should ONLY be managed here when there is a good reason for it, otherwise stick to `useState()` and related hooks.

## Consumption

State can be consumed using the useStores hook (`@hooks/useStores`).

```tsx
import { useStores, useAuth } from '@hooks/useStores'
import { observer } from 'mobx-react-lite'

// To listen to changes in a store, use the `observer` Higher-Order Component.
// This is not required but a good idea if theres the possibility
// of changes in the state (e.g a user might log out).
export const MyComponent = observer(() => {
  const { auth } = useStores()
  // or using the alias
  const auth = useAuth()

  return (
    <>
      <h1>{auth?.user?.username}</h1>
    </>
  )
})
```

## Caveats

When using global state values together with async hooks, always wait or check if they exist first:

```tsx
//...
const { auth } = useStores()

// graphql queries provide this nice skip option that can be used to wait for something
const { loading, error, data } = useSomeQuery({ skip: !auth.user })
//...
```

## Adding Stores

Stores need to be added in `stores/context.ts`. For further information, check out the existing auth store in this folder.
