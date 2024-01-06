import React from 'react'
import { InfoBox, InfoBoxProps } from './'
import { Story } from '@storybook/react'

export default {
  title: 'Components/UI/InfoBox',
  component: InfoBox,
}

interface CustomArgs extends InfoBoxProps {}

export const ExampleInfoBox: Story<CustomArgs> = ({ ...args }) => (
  <InfoBox {...args}>Example Text</InfoBox>
)

ExampleInfoBox.args = {
  title: 'title lol',
}
