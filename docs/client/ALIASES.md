# Aliases

Our Frontend has a number of useful aliases for importing frequently used folders:

```bash
@app          -> src/app
@components   -> src/app/components
@handlers     -> src/app/handlers
@pages        -> src/app/pages
@utils        -> src/app/utils
@hooks        -> src/app/hooks
@stores       -> src/app/stores

@style        -> src/style
@static       -> src/static
@generated    -> src/generated
```

## Usage

```ts
import SomeComponent from '@components/some-component'
import { parseJWT } from '@utils/cookies'
import { User } from '@generated/graphql'
```

## Adding Aliases

When adding new aliases, remember to add them in here and in `packages/client/tsconfig.json`
