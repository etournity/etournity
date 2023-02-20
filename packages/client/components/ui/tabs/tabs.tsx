import React, { ReactElement, useState } from 'react'
import { TabHeader } from './tabHeader'
import { TabProps } from './tab'
import styles from './tabs.module.scss'
import classNames from 'classnames'

interface Props {
  children: Array<ReactElement<TabProps>>
  extra?: (activeTab: number) => React.ReactElement
  className?: string
  onChange?: (activeTab: number) => void
}

export const Tabs: React.FC<Props> = ({
  children,
  extra,
  className,
  onChange,
}) => {
  const [selectedTab, setSelectedTab] = useState(0)

  return (
    <div className={classNames(styles.tabComp, className)}>
      <div className={styles.tabWrapper}>
        <div className={styles.tabs}>
          {children.map((child, index) => (
            <TabHeader
              key={
                typeof child.props.header === 'string'
                  ? child.props.header
                  : `${child.type.toString()}-${index}`
              }
              header={child.props.header}
              index={index}
              setSelectedTab={(i) => {
                setSelectedTab(i)
                onChange?.(i)
              }}
              selectedTab={selectedTab}
              badge={child.props.badge}
              className={child.props.className}
            />
          ))}
        </div>
        {extra && <div className={styles.header}>{extra(selectedTab)}</div>}
      </div>
      <div className={styles.content}>{children[selectedTab]}</div>
    </div>
  )
}
