import React from 'react'
import { RoundAction, RoundActionProps } from './'
import { Story } from '@storybook/react'

export default {
  title: 'Components/Tournament/RoundAction',
  component: RoundAction,
}

interface CustomArgs extends RoundActionProps {}

export const ExampleRoundAction: Story<CustomArgs> = ({ ...args }) => (
  <RoundAction {...args} />
)

ExampleRoundAction.args = {}
