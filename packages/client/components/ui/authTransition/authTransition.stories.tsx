import React from 'react'
import { AuthTransition, AuthTransitionProps } from '.'
import { Story } from '@storybook/react'

export default {
  title: 'Components/UI/AuthTransition',
  component: AuthTransition,
}

interface CustomArgs extends AuthTransitionProps {
  successfull: boolean
}

export const ExampleAuthTransition: Story<CustomArgs> = ({ ...args }) => (
  <div
    style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <AuthTransition {...args}>
      <div>Example Text</div>
    </AuthTransition>
  </div>
)

ExampleAuthTransition.args = {
  successfull: true,
}
