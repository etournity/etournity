import React, { ReactNode, ReactElement } from 'react'
import classNames from 'classnames'
import styles from './table.module.scss'
import { HeaderItemProps } from './headerItem'

export interface TableItemProps {
  itemData: Record<string, ReactNode>
  columns?: HeaderItemProps[]
  leading?: ReactElement
  seperatorColor?: string
  borderColor?: string
  className?: string
  slim?: boolean
  onClick?: () => void
}

export const TableItem: React.FC<TableItemProps> = ({
  itemData,
  columns,
  leading,
  seperatorColor,
  borderColor,
  className,
  slim,
  onClick,
}) => (
  <div
    className={classNames(styles.tableItem, className, {
      [styles.hasLeading]: leading !== undefined,
      [styles.slim]: slim,
      [styles.isBlocking]: borderColor === styles.error,
    })}
    onClick={onClick}
  >
    {leading && <leading.type className={styles.leading} {...leading.props} />}
    <div
      className={styles.sectionWrapper}
      style={{ borderColor: borderColor ?? styles.primary }}
    >
      {columns?.map((column) => (
        <div
          key={column.key}
          className={classNames(styles.itemSection)}
          style={{ width: `${column.width ?? 5}rem` }}
        >
          <div
            className={styles.seperator}
            style={{ backgroundColor: seperatorColor }}
          />

          {typeof itemData[column.key] === 'string' ? (
            <span className={styles.itemText}>{itemData[column.key]}</span>
          ) : typeof itemData[column.key] === 'number' ? (
            <span className={styles.itemNumber}>{itemData[column.key]}</span>
          ) : (
            itemData[column.key]
          )}
        </div>
      ))}
    </div>
  </div>
)
