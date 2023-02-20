import { Story } from '@storybook/react'
import React, { useState } from 'react'
import { Button } from '../button'
import { AccessWrapper, AccessWrapperProps } from './'
import styles from './accessWrapper.module.scss'

export default {
  title: 'Components/UI/AccessWrapper',
  component: AccessWrapper,
  argTypes: {
    type: {
      options: ['static', 'hover'],
      control: { type: 'radio' },
    },
    backgroundColor: { control: 'color' },
    backgroundOpacity: {
      control: { type: 'number', step: 0.1, min: 0, max: 1 },
    },
  },
}

export const ExampleCard: Story<AccessWrapperProps> = ({ ...args }) => {
  const [access, setAccess] = useState(false)
  return (
    <div style={{ width: '30rem' }}>
      <AccessWrapper {...args} hasAccess={access}>
        <div
          style={{
            height: '20rem',
            borderRadius: '1rem',
            background: styles.mattBlack,
            padding: '1rem',
          }}
        >
          <span>There is some content in here!</span>
          <span>There is some content in here!</span>
          <span>There is some content in here!</span>
        </div>
      </AccessWrapper>
      <Button onClick={() => setAccess(!access)}>
        {access ? 'Lock' : 'Unlock'}
      </Button>
    </div>
  )
}

ExampleCard.args = {
  title: 'LOCKED',
  backgroundOpacity: 0.8,
  backgroundColor: styles.void,
  message: 'You are missing access rights!',
  type: 'static',
  hasAccess: false,
}
