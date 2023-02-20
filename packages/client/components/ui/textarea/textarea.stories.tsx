import React from 'react'
import { withKnobs, boolean, text } from '@storybook/addon-knobs'
import { TextArea } from '.'

export default {
  title: 'Components/UI/TextArea',
  component: TextArea,
  decorators: [withKnobs],
}
export const ExampleTextarea = () => (
  <TextArea
    placeholder={text('Placeholder', 'TEXT')}
    disabled={boolean('Disabled', false)}
    success={boolean('Success', false)}
    validate={() =>
      boolean('Error', false) ? text('ErrorText', 'Test Error') : null
    }
  />
)
