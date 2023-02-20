import React, { useState } from 'react'
import { withKnobs } from '@storybook/addon-knobs'
import { MuiModal, MuiModalActions } from './'
import { Button, Typography } from '@mui/material'
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward'

export default {
  title: 'Components/UI/MuiModal',
  component: MuiModal,
  decorators: [withKnobs],
}

export const ExampleMuiModal = () => {
  const [open, setOpen] = useState(true)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <div
        style={{
          height: 500,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#1c1c1c',
        }}
      >
        <Button onClick={handleOpen}>Open Modal</Button>
      </div>
      <MuiModal
        open={open}
        title="Registration"
        icon={<AccessibleForwardIcon />}
        onClose={handleClose}
      >
        <Typography>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis hic iste
          ipsum, assumenda omnis ipsam doloribus facilis perferendis repellat
          cupiditate enim cumque! Minima, reprehenderit. Quam, ad. Fugiat
          voluptate earum et?
        </Typography>
        <MuiModalActions>
          <Button onClick={handleClose}>Cancel</Button>
        </MuiModalActions>
      </MuiModal>
    </>
  )
}
