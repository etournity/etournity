import React, { ReactElement, ReactNode } from 'react'

export interface TabProps {
  header?: ReactNode
  badge?: number
  addon?: React.ReactNode
  className?: string
  children: ReactElement
}

export const Tab: React.FC<TabProps> = ({ children }) => (
  <children.type {...children.props} />
)
