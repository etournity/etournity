import React, { ReactElement } from 'react'
import { ApolloError } from '@apollo/client/errors'
import { Loader } from '@components/ui/loader'
import { toast } from 'react-hot-toast'
import { Empty } from '@components/ui/empty'
import { QueryResult } from '@apollo/client'

interface DataHandlerProps {
  loading: boolean
  error?: ApolloError
  errorDisplay?: ReactElement | string
  noDataDisplay?: ReactElement | string
  dataAvailable: boolean
  children?: ReactElement
}

export const shouldDataHandle = (queryResults: QueryResult[]): boolean =>
  queryResults.some(
    (result) => (result.loading || result.error) ?? !result.data
  )

export const DataHandler: React.FunctionComponent<DataHandlerProps> = ({
  loading,
  error,
  errorDisplay,
  noDataDisplay,
  dataAvailable,
  children,
}) => {
  if ((!dataAvailable && !error) || (loading && !dataAvailable)) {
    return <Loader size={4} strokeWidth={0.375} />
  }

  if (error) {
    if (errorDisplay) {
      if (typeof errorDisplay === 'string')
        return <Empty description={errorDisplay} />
      return errorDisplay
    }

    console.error(error)
  }

  if (!dataAvailable) {
    if (!noDataDisplay || typeof noDataDisplay === 'string')
      toast.error(noDataDisplay ?? "404. Couldn't fetch data.")
    else return noDataDisplay
  }

  return children ?? null
}
