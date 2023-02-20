import React, { useState } from 'react'
import { withKnobs, text } from '@storybook/addon-knobs'
import { ConfirmationModal } from './'
import { Button } from '../button'

export default {
  title: 'Components/UI/ConfirmationModal',
  component: ConfirmationModal,
  decorators: [withKnobs],
}

export const ExampleConfirmationModal = () => {
  const [active, setActive] = useState(true)
  const [result, setResult] = useState('')

  return (
    <>
      <div
        style={{
          height: 500,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#1c1c1c',
        }}
      >
        <Button onClick={() => setActive(!active)}>Open Modal</Button>
        <div>{result}</div>
      </div>
      <ConfirmationModal
        title={text('Modal Title', 'Title or something like that.')}
        description={text(
          'Modal Description',
          'Description n shit like that Are you sure u wanna do this bitch?'
        )}
        note={text('Note', 'You cannot go back after confirming')}
        active={active}
        onPrimary={() => setResult('confirm')}
        onCancel={() => setResult('cancel')}
      />
    </>
  )
}
