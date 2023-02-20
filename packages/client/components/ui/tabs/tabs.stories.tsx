import React from 'react'
import { Tabs } from './tabs'
import { Tab } from './tab'
import { number, text } from '@storybook/addon-knobs'

export default {
  title: 'Components/UI/Tabs',
  component: Tabs,
}
export const ExampleTabsComponent = () => (
  <Tabs extra={() => <div>Hallo</div>}>
    <Tab header={text('Title1', 'TitleExample')} badge={number('Badge1', 2)}>
      <span>Tab 1</span>
    </Tab>
    <Tab header={text('Title2', 'TitleExample2')} badge={number('Badge2', 4)}>
      <span>Tab 2</span>
    </Tab>
    <Tab
      header={text('Title3', 'Lame Title Example')}
      badge={number('Badge3', 200)}
    >
      <span>Tab 3</span>
    </Tab>
  </Tabs>
)
