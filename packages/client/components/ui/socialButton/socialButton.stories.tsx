import React from 'react'
import { SocialButton, SocialButtonProps } from '.'
import { Story } from '@storybook/react'

export default {
  title: 'Components/UI/SocialButton',
  component: SocialButton,
}

export const ExampleSocialButton: Story<SocialButtonProps> = ({ ...args }) => (
  <div>
    <SocialButton {...args} />
  </div>
)

ExampleSocialButton.args = {
  link: 'https://www.example.com/blog?search=hello&world',
}
