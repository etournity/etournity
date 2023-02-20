import React from 'react'
import { Radio, RadioGroup } from './'
import styles from './radio.module.scss'

export default {
  title: 'Components/UI/Radio',
  component: Radio,
}

export const ExampleRadio = () => (
  <RadioGroup name="radio" onChecked={(value) => console.log(value)}>
    <Radio label="Option 1" value="a">
      <Radio label="Option 1.1" value="b" />
      <Radio label="Option 1.2" value="c" />
    </Radio>
    <Radio label="Option 2" value="d" />
    <Radio label="Option 3" value="e" />
  </RadioGroup>
)
