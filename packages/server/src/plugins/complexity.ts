import { ApolloServerPlugin } from 'apollo-server-plugin-base'
import { getComplexity, simpleEstimator } from 'graphql-query-complexity'

import { GraphQLSchema, separateOperations } from 'graphql'

export const apolloComplexityPlugin = (
  schema: GraphQLSchema
): ApolloServerPlugin => ({
  requestDidStart: async () => ({
    didResolveOperation: async ({ request, document }) => {
      const complexity = getComplexity({
        schema,
        query: request.operationName
          ? separateOperations(document)[request.operationName]
          : document,
        variables: request.variables,
        estimators: [simpleEstimator({ defaultComplexity: 1 })],
      })

      if (complexity > (parseInt(process.env.MAX_COMPLEXITY || '', 10) || 60)) {
        throw new Error(
          `The provided query is too complicated! The complexity is ${complexity} out of a maximum of ${
            process.env.MAX_COMPLEXITY ?? ''
          }.`
        )
      }
    },
  }),
})
