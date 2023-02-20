import { ReactElement } from 'react'

export const ConditionalWrapper = ({
  condition,
  wrapper,
  altWrapper,
  children,
}: {
  condition: boolean
  wrapper: (children: ReactElement) => ReactElement
  altWrapper?: (children: ReactElement) => ReactElement
  children: ReactElement
}) =>
  condition ? wrapper(children) : altWrapper ? altWrapper(children) : children
