import { useMemo } from 'react'
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  ApolloCache,
  split,
  from,
} from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { onError } from '@apollo/client/link/error'
import { RetryLink } from '@apollo/client/link/retry'
import { createClient } from 'graphql-ws'
import { authVar } from '@state/authVar'
import { ticketsVar } from '@state/tickets'
import { tournamentsVar } from '@state/tournaments'

let apolloClient: ApolloClient<NormalizedCacheObject>
function createApolloClient() {
  const httpLink = new HttpLink({
    uri: `${process.env.GRAPHQL_SERVER_URL}/graphql`,
    credentials: 'include',
  })

  const wsLink =
    typeof window === 'undefined'
      ? null
      : new GraphQLWsLink(
          createClient({
            url: `${process.env.GRAPHQL_WS_URL}/graphql`,
            retryAttempts: 5,
          })
        )

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(
          `[GraphQL error]: ${message}\nLocation: ${JSON.stringify(
            locations
          )}\nPath: ${path}`
        )
      })

    if (networkError) console.error(`[Network error]: ${networkError.message}`)
  })

  const retryLink = new RetryLink({
    delay: {
      initial: 300,
      max: Infinity,
      jitter: true,
    },
    attempts: {
      max: 5,
      retryIf: (error) => Boolean(error),
    },
  })

  const splitLink = wsLink
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query)
          return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
          )
        },
        wsLink,
        httpLink
      )
    : httpLink

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: from([errorLink, retryLink, splitLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            authInfo: {
              read() {
                return authVar()
              },
            },
            relatedTickets: {
              read() {
                return ticketsVar()
              },
            },
            tournamentInfo: {
              read() {
                return tournamentsVar()
              },
            },
          },
        },
      },
    }),
    credentials: 'include',
    defaultOptions: {
      watchQuery: {
        refetchWritePolicy: 'overwrite',
      },
    },
  })
}

export function initializeApollo(
  initialState: ApolloCache<NormalizedCacheObject> | null = null
) {
  const _apolloClient = apolloClient ?? createApolloClient()

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()
    // Restore the cache using the data passed from getStaticProps/getServerSideProps
    // combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState })
  }

  // For SSG and SSR always create a new Apollo Client
  if (!process.browser) return _apolloClient

  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export function useApollo(
  initialState: ApolloCache<NormalizedCacheObject> | null
) {
  const store = useMemo(() => initializeApollo(initialState), [initialState])
  return store
}
