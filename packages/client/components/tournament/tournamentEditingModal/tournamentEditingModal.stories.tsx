import React from 'react'
import { Story } from '@storybook/react'
import {
  TournamentEditingModal,
  TournamentEditingModalProps,
} from './tournamentEditingModal'
import { Toaster } from 'react-hot-toast'
export default {
  title: 'Components/Tournament/EditingModal',
  component: TournamentEditingModal,
}

interface CustomArgs extends TournamentEditingModalProps {}

export const ExampleTournamentEditingModal: Story<CustomArgs> = ({
  ...args
}) => (
  <>
    <Toaster position="top-right" />
    <TournamentEditingModal {...args} active />
  </>
)

ExampleTournamentEditingModal.args = {}
