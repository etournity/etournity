import React from 'react'
import { Checkbox } from './'

export default {
  title: 'Components/UI/Checkbox',
  component: Checkbox,
}
export const ExampleCheckbox = () => (
  <div
    style={{
      height: '4rem',
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'column',
    }}
  >
    <Checkbox name="pc">PC</Checkbox>
    <Checkbox name="switch">Switch</Checkbox>
    <Checkbox name="mobile">Mobile</Checkbox>
  </div>
)
