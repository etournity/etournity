import React from 'react'
import { RichTextEditor } from '.'

export default {
  title: 'Components/UI/RichTextEditor',
  component: RichTextEditor,
}

export const ExampleRichTextEditor = ({ ...args }) => (
  <RichTextEditor placeholder="Placeholder" onChange={console.log} {...args} />
)

ExampleRichTextEditor.args = {}
