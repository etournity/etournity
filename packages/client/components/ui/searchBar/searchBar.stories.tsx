import { text } from '@storybook/addon-knobs'
import React, { useState } from 'react'
import { SearchBar } from './'

export default {
  title: 'Components/UI/SearchBar',
  component: SearchBar,
}
export const ExampleSearchBar = () => {
  const [value, setValue] = useState('')
  return (
    <SearchBar
      placeholder={text('Placeholder', 'SEARCH')}
      value={value}
      onChange={(change) => setValue(change)}
    />
  )
}
