import React from 'react'
import { withKnobs, text, select, boolean } from '@storybook/addon-knobs'
import { Button } from './'

export default {
  title: 'Components/UI/Button',
  component: Button,
  decorators: [withKnobs],
}
export const ExampleButton = () => (
  <Button
    variant={select('Variants', ['primary', 'secondary', 'ghost'], 'primary')}
    disabled={boolean('Disabled', false)}
  >
    {text('Label', 'Button')}
  </Button>
)
