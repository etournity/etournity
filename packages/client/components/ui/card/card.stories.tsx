import { Story } from '@storybook/react'
import React from 'react'
import { Card, CardProps } from './'
import styles from './card.module.scss'

export default {
  title: 'Components/UI/Card',
  component: Card,
  argTypes: {
    headerColor: {
      control: {
        type: 'color',
        presetColors: [styles.white, styles.primary, styles.middleGrey],
      },
    },
  },
}

export const ExampleCard: Story<CardProps> = ({ ...args }) => (
  <Card {...args}>
    <span>This is content UwU</span>
  </Card>
)

ExampleCard.args = {
  title: 'This is title',
  insetTitle: false,
  borderRadius: 2,
  headerColor: styles.white,
}
