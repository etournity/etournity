import React from 'react'
import { withKnobs, number, select } from '@storybook/addon-knobs'
import { Loader } from './'

export default {
  title: 'Components/UI/Loader',
  component: Loader,
  decorators: [withKnobs],
}
export const ExampleLoader = () => (
  <Loader
    size={number('Size', 1.5)}
    color={select('Color', ['white', 'black', 'gradient'], 'white')}
  />
)
