import React from 'react'
import { NextPage, NextPageContext } from 'next'
import { ErrorResult } from '@components/results/errorResult'

const Error: NextPage<{ statusCode: number }> = ({ statusCode }) => (
  <ErrorResult
    title={`${statusCode ?? ''} Error encountered!`}
    description="Make sure to let us know what led you here."
  />
)
Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 404
  return { statusCode }
}

export default Error
