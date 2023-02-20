import React from 'react'
import { ProgressBar, ProgressCircle } from './'
import { withKnobs, number, text, color, select } from '@storybook/addon-knobs'

export default {
  title: 'Components/UI/Progress',
  component: [ProgressBar, ProgressCircle],
  decorators: [withKnobs],
}

export const ExampleProgressBar = () => (
  <div>
    <h2>Progress Bar</h2>
    <div style={{ width: '20rem' }}>
      <span>Standart Text:</span>
      <ProgressBar
        percent={number('Percent (%)', 50, { min: 0, max: 100 })}
        strokeWidth={number('Stroke width (rem)', 0.25, { step: 0.125 })}
      />
      <span>Custom Text:</span>
      <ProgressBar
        percent={number('Percent (%)', 50, { min: 0, max: 100 })}
        strokeWidth={number('Stroke width (rem)', 0.25, { step: 0.125 })}
        description={text('Custom Text', '1/2 Players Ready')}
      />
      <span>Custom Colors:</span>
      <ProgressBar
        percent={number('Percent (%)', 50, { min: 0, max: 100 })}
        strokeWidth={number('Stroke width (rem)', 0.25, { step: 0.125 })}
        fillColor={color('Fill Color', '#acf7f0')}
        backgroundColor={color('Background Color', '#000')}
      />
    </div>
  </div>
)

export const ExampleProgressCircle = () => (
  <div>
    <h2>Progress Circle</h2>
    <div style={{ width: '20rem' }}>
      <span>Standard:</span>
      <ProgressCircle
        size={number('Size (rem)', 3)}
        percent={number('Percent (%)', 10, { min: 0, max: 100 })}
        strokeWidth={number('Stroke width (rem)', 0.25, { step: 0.125 })}
      />
      <span>Custom Icon:</span>
      <ProgressCircle
        size={number('Size (rem)', 3)}
        percent={number('Percent (%)', 10, { min: 0, max: 100 })}
        strokeWidth={number('Stroke width (rem)', 0.25, { step: 0.125 })}
        icon={{ variant: 'people', rotate: 0 }}
      />
      <span>Custom FillColor:</span>
      <ProgressCircle
        size={number('Size (rem)', 3)}
        percent={number('Percent (%)', 10, { min: 0, max: 100 })}
        strokeWidth={number('Stroke width (rem)', 0.25, { step: 0.125 })}
        progressColor={color('Fill Color', '#acf7f0')}
      />
      <span>Custom Description:</span>
      <ProgressCircle
        size={number('Size (rem)', 3)}
        percent={number('Percent (%)', 10, { min: 0, max: 100 })}
        strokeWidth={number('Stroke width (rem)', 0.25, { step: 0.125 })}
        description={text('Description', '1/2 Ready')}
        descriptionPlacement={select(
          'Description Placement',
          ['center', 'top', 'left', 'bottom', 'right'],
          'right'
        )}
        icon={{ variant: 'close' }}
      />
    </div>
  </div>
)
