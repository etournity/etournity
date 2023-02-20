import React from 'react'
import { AddTime, AddTimeProps } from './'
import { Story } from '@storybook/react'

export default {
  title: 'Components/Tournament/AddTime',
  component: AddTime,
}

interface CustomArgs extends AddTimeProps {}

export const ExampleAddTime: Story<CustomArgs> = ({ ...args }) => (
  <AddTime {...args} />
)

ExampleAddTime.args = {}
