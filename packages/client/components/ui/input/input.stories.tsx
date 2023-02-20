import React from 'react'
import { Input, InputProps } from './'
import { Story } from '@storybook/react'

export default {
  title: 'Components/UI/Input',
  component: Input,
  argTypes: {
    onChange: {
      action: 'changed',
      table: {
        disable: true,
      },
    },
  },
}

interface CustomArgs extends InputProps {
  error: boolean
  errorText: string
}

export const ExampleInput: Story<CustomArgs> = ({
  error,
  errorText,
  ...args
}) => <Input {...args} validate={() => (error ? errorText : null)} />

ExampleInput.args = {
  placeholder: 'TEXT',
  disabled: false,
  success: false,
  error: false,
  errorText: 'You did an oopsie!',
}
