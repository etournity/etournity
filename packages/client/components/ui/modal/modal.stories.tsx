import React, { useState } from 'react'
import { withKnobs, text, boolean } from '@storybook/addon-knobs'
import { Modal, ModalActions } from './'
import { Button } from '../button'

export default {
  title: 'Components/UI/Modal',
  component: Modal,
  decorators: [withKnobs],
}

export const ExampleModal = () => {
  const [active, setActive] = useState(true)
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
      </div>
      <Modal
        active={active}
        hideCloseButton={boolean('hideCloseButton', false)}
        onClose={() => setActive(false)}
      >
        <h2>{text('Modal Title', 'Title or something like that.')}</h2>
        <p>
          {text(
            'Modal Content',
            'Description and stuff like that, I really dont know what is going in here for now but I am sure something really important, for example how your last meal was.'
          )}
        </p>
        <ModalActions>
          <Button variant="secondary" onClick={() => setActive(false)}>
            Action
          </Button>
          <Button onClick={() => setActive(false)}>Primary Action</Button>
        </ModalActions>
      </Modal>
    </>
  )
}
