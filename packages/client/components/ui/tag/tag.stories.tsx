import React from 'react'
import { Tag, TagProps } from '.'
import { Story } from '@storybook/react'

export default {
  title: 'Components/UI/Tag',
  component: Tag,
}

export const ExampleTag: Story<TagProps> = ({ ...args }) => (
  <div>
    <Tag {...args} />
  </div>
)

ExampleTag.args = {
  icon: 'lock',
  description: '1v1',
}
