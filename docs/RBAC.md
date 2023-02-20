# Access Control

Roles and permissions can easily be defined in `packages/rbac/roles.ts`.
Permissions should follow `{subject}.{activity}` for their naming (e.g. `tournament.create`) and be in `kebab-case`.

Access control is handled by our `@etournity/rbac` helper which exports a `hasPermissions` function. This function can be used directly in a resolver or in a seperate function that checks the access for all resources, for more information about that, checkout [this blog post](https://www.apollographql.com/blog/auth-in-graphql-part-2-c6441bcc4302).

```ts
import { hasPermissions } from '@etournity/rbac'

hasPermissions(user, ['tournament.create', 'tournament.join'])
```
