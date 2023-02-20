import { ErrorResult } from '@components/results/errorResult'
import { Button } from '@components/ui/button'
import React from 'react'
import Link from 'next/link'

const Error = () => (
  <ErrorResult
    hideReportButton
    title="404"
    description="ah yes, nothing"
    customActions={
      <Link key="back" passHref href="/">
        <Button>Fuck, Go Back!</Button>
      </Link>
    }
  />
)

export default Error
