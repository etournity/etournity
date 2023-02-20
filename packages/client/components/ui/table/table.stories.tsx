import React, { ReactNode } from 'react'
import { Table, TableItem } from './'
import { Button } from '../button'
import { Icon } from '../icon'

export default {
  title: 'Components/UI/Table',
  component: Table,
}
const data: Array<Record<string, ReactNode>> = [
  {
    test1: 1,
    test2: 'b',
    test3: 'Some more text in a diferrent field.',
    action: (
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          flex: '1',
          marginRight: '1rem',
        }}
      >
        <Button variant="primary">Test Button</Button>
      </div>
    ),
  },
  {
    test1: 2,
    test2: 'a',
  },
  { test1: 1234, test2: 'Some description.', test3: 1234 },
  {
    test1: 33,
    test2:
      'Some description. Some description. Some description. Some description. Some description. Some description. Some description. Some description. Some description. Some description. Some description. Some description.',
    test3: 'Missing data above. Number below.',
  },
]
export const TableExample = () => (
  <div style={{ width: 'max-content' }}>
    <Table
      loading={false}
      headers={[
        { label: 'ID-Nr.', key: 'test1', width: 5, sortable: true },
        { label: 'Description', key: 'test2', width: 15, sortable: true },
        { label: 'Test3', key: 'test3', width: 10 },
        { label: '', key: 'action', width: 10 },
      ]}
    >
      <TableItem
        itemData={data[0]}
        leading={
          <div
            style={{
              background: '#f44040',
              alignSelf: 'stretch',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Icon variant="warn" color="#0f0f0f" />
          </div>
        }
        seperatorColor="#f44040"
        borderColor="#f44040"
      />

      <TableItem itemData={data[1]} seperatorColor="#6b6b6b" />
      <TableItem itemData={data[2]} />

      <TableItem slim itemData={data[3]} />
    </Table>
  </div>
)
