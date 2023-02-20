import { ApolloError } from '@apollo/client'
import { toast } from 'react-hot-toast'

export const handleError = (error: ApolloError) => {
  const { graphQLErrors } = error

  if (graphQLErrors) {
    graphQLErrors.forEach(({ extensions, message }) => {
      if (extensions?.code === 'UNAUTHENTICATED') return

      toast.error(message, { id: message, duration: 2500 })
    })
  }
}
