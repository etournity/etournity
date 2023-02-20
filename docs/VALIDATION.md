# Validation

Since validation schemas need to be accessed by both the server and client they are stored in the `@etournity/shared` package.
All the schemas should be stored in the `/models` subfolder and be added to the `index.ts` in the package root.

In some cases the client and server will need to validate the same data. In this case you can export the same json object for both. Keeping these seperate is important in case at some point the client and server schemas end up deverging.

## Client

Because of the central `index.ts` you can import schemas from the `@etournity/validation` package and use them like this:

```ts
import { createTournamentSchema } from '@etournity/shared/validation'

await Yup.object(createTournamentSchema.client).validate(values, {
  abortEarly: false, // Prevents the validation from only returning the first error
})
```

or in case of a Formik form:

```tsx
import { createTournamentSchema } from '@etournity/shared/validation'

<Formik
    validationSchema={tournamentRegisterSchema.client}
    {...rest}
>
```

## Server

For the server side of things, just add the schema to the `yup.ts` in the package root inside the `mutationYupValidationSchemaMap` object depending on where the validation should be applied.

## Helpers

There are some important helper functions inside the `helpers.ts` file that can help with bringing the error object returned by yup in the correct format, notably `convertErrorsToFieldSpecific()` and `convertErrorsToFormSpecific()`. The former of which is used when the field hierarchy of the data object is flat and the latter for cases where it's nested.
