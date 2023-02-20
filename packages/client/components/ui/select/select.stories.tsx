import React, { useState } from 'react'
import { withKnobs, boolean, text } from '@storybook/addon-knobs'
import { Select } from '.'

export default {
  title: 'Components/UI/Select',
  component: Select,
  decorators: [withKnobs],
}

export const ExampleInput = () => {
  const [value, setValue] = useState<string | null>(null)

  return (
    <div style={{ maxWidth: 400 }}>
      <p>Uncontrolled</p>
      <Select<string>
        placeholder={text('Placeholder', 'Favorite Color')}
        disabled={boolean('Disabled', false)}
        success={boolean('Success', false)}
        validate={() =>
          boolean('Error', false) ? text('ErrorText', 'Test Error') : null
        }
        options={[
          { title: 'Green', value: 'green' },
          { title: 'Red', value: 'red' },
          { title: 'Blue', value: 'blue' },
        ]}
        onChange={console.log}
      />
      <p>Controlled</p>
      <Select<string>
        placeholder="Favorite Ice Cream"
        disabled={boolean('Disabled', false)}
        success={boolean('Success', false)}
        options={[
          { title: 'Chocolate', value: 'chocolate' },
          { title: 'Vanilla', value: 'vanilla' },
          { title: 'Mint', value: 'mint' },
        ]}
        value={value}
        onChange={(change) => {
          console.log(change)
          setValue(change?.value ?? '')
        }}
      />
    </div>
  )
}
