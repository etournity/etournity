import React from 'react'
import {
  withKnobs,
  number,
  select,
  color,
  boolean,
} from '@storybook/addon-knobs'
import { Icon } from './'
import { iconPath, Variants } from '@iconLib'

export default {
  title: 'Components/UI/Icon',
  component: Icon,
  decorators: [withKnobs],
}
export const ExampleIcon = () => (
  <Icon
    variant={select('Variants', Object.keys(iconPath), 'chevron') as Variants}
    size={number('Size', 1.5)}
    color={boolean('Gradient', false) ? 'gradient' : color('Color', '#efefef')}
    rotate={select(
      'Rotation',
      ['up', 'down', 'left', 'right', 45, 135, 225, 315],
      'up'
    )}
  />
)
export const AllIcons = () => (
  <div style={{ display: 'flex' }}>
    <div style={{ display: 'grid', grid: 'row' }}>
      <div>
        <span>chevron:</span>
        <Icon variant="chevron" />
      </div>
      <div>
        <span>clock:</span>
        <Icon variant="clock" />
      </div>
      <div>
        <span>closeCircle:</span>
        <Icon variant="closeCircle" />
      </div>
      <div>
        <span>closeSquare:</span>
        <Icon variant="closeSquare" />
      </div>
    </div>
    <div style={{ display: 'grid', marginLeft: '1rem' }}>
      <div>
        <span>tickCircle:</span>
        <Icon variant="tickCircle" />
      </div>
      <div>
        <span>tickSquare:</span>
        <Icon variant="tickSquare" />
      </div>
      <div>
        <span>copy:</span>
        <Icon variant="copy" />
      </div>
      <div>
        <span>info:</span>
        <Icon variant="info" />
      </div>
    </div>
    <div style={{ display: 'grid', marginLeft: '1rem' }}>
      <div>
        <span>send:</span>
        <Icon variant="send" />
      </div>
      <div>
        <span>skip:</span>
        <Icon variant="skip" />
      </div>
      <div>
        <span>people:</span>
        <Icon variant="people" />
      </div>
    </div>
  </div>
)
