import React, { ReactElement, useState, useEffect } from 'react'
import styles from './table.module.scss'
import { HeaderItem, HeaderItemProps } from './headerItem'
import { TableItem, TableItemProps } from './tableItem'
import { Empty } from '../empty'
import { Loader } from '../loader'
import classNames from 'classnames'

interface TableProps {
  headers: HeaderItemProps[]
  children?: Array<ReactElement<TableItemProps>>
  emptyPlaceholder?: ReactElement
  loading?: boolean
  hideUnderline?: boolean
  maxHeight?: string
}

export const Table: React.FC<TableProps> = ({
  headers,
  children,
  emptyPlaceholder,
  loading = true,
  maxHeight,
  hideUnderline,
}) => {
  const [sorted, setSorted] = useState(children)

  const allowedKeys: string[] = ['empty', 'action', '']

  const keys =
    children?.flatMap((item) => Object.keys(item.props.itemData)) ?? []

  const usedKeys = keys.filter((key, index) => keys.indexOf(key) === index)

  const itemsHaveData = children?.some(
    (item) => item.props.itemData !== undefined
  )

  const itemsHaveLeading = children?.some(
    (item) => item.props.leading !== undefined
  )

  if (itemsHaveData) {
    headers.forEach((header) => {
      if (!usedKeys.concat(allowedKeys).includes(header.key)) {
        throw new Error(`Header key: ${header.key} is not present on object.`)
      }
    })
  }

  const sortedItems = (keyToSort: string, order: 'ASC' | 'DESC' | 'NONE') => {
    headers.forEach((header) => {
      if (header.key === keyToSort) {
        header.currentOrder =
          order === 'NONE' ? 'ASC' : order === 'ASC' ? 'DESC' : 'NONE'
        order = header.currentOrder
      } else {
        header.currentOrder = 'NONE'
      }
    })
    if (!children) return []
    if (order === 'NONE') return children

    const mapped = children.map((item, index) => ({
      index,
      value: item.props.itemData[keyToSort],
    }))

    mapped?.sort((a, b) => {
      if (typeof a.value === 'object' && typeof b.value === 'object') {
        a.value = (a.value as JSX.Element)?.key
        b.value = (b.value as JSX.Element)?.key
        if (!a.value) {
          if (process.env.ETY_ENV === 'local')
            console.error(`Field is missing key! Add value to sort as key.`)
          a.value = 1
        }

        if (!b.value) {
          if (process.env.ETY_ENV === 'local')
            console.error(`Field is missing key! Add value to sort as key.`)
          b.value = 1
        }
      }

      if (typeof a.value === 'number' && typeof b.value === 'number') {
        if (order === 'ASC') return a.value - b.value
        return b.value - a.value
      }

      if (
        (a.value?.toString().toUpperCase() ?? '1') <
        (b.value?.toString().toUpperCase() ?? '1')
      )
        return order === 'ASC' ? -1 : 1
      if (
        (a.value?.toString().toUpperCase() ?? '1') >
        (b.value?.toString().toUpperCase() ?? '1')
      )
        return order === 'ASC' ? 1 : -1

      return 0
    })
    return mapped.map((item) => children[item.index]) ?? []
  }

  useEffect(() => {
    setSorted(children)
  }, [children, setSorted])

  if (loading)
    return (
      <div className={styles.empty}>
        <Loader />
      </div>
    )

  return (
    <div className={styles.tableWrapper}>
      <div
        className={classNames(styles.tableHeader, {
          [styles.hideUnderline]: hideUnderline,
        })}
      >
        {headers.map((header) => (
          <HeaderItem
            key={header.key}
            label={header.label}
            width={header.width}
            hasLeading={itemsHaveLeading}
            sortable={header.sortable}
            currentOrder={header.currentOrder ?? 'NONE'}
            onSort={(order) =>
              header.onSort ?? setSorted(sortedItems(header.key, order))
            }
          />
        ))}
      </div>
      <div className={styles.tableContent} style={{ maxHeight }}>
        {itemsHaveData
          ? sorted?.map((item, index) => {
              if (item.props.itemData === undefined) return null
              return (
                <TableItem
                  key={`${item.props.itemData[0]?.toString()}${index}`}
                  columns={headers}
                  {...item.props}
                />
              )
            })
          : emptyPlaceholder ?? (
              <div className={styles.empty}>
                <Empty description="No table data available." />
              </div>
            )}
      </div>
    </div>
  )
}
