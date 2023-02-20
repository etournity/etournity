import React from 'react'
import {
  Box,
  TextField,
  IconButton,
  OutlinedTextFieldProps,
} from '@mui/material'
import SendOutlined from '@mui/icons-material/SendOutlined'
import styles from './chat.module.scss'

interface MessageInputProps extends OutlinedTextFieldProps {
  handleSubmit: () => void
}

export const MessageInput: React.FC<MessageInputProps> = ({
  variant = 'outlined',
  handleSubmit,
  ...rest
}) => (
  <Box className={styles.messageInput}>
    <TextField
      fullWidth
      maxRows={4}
      variant={variant}
      type="text"
      label="Message"
      InputProps={{
        endAdornment: (
          <IconButton
            onClick={() => {
              handleSubmit()
            }}
          >
            <SendOutlined />
          </IconButton>
        ),
      }}
      onKeyDown={(e: any) => {
        if (e.key === 'Enter' && !e.shiftKey) handleSubmit()
      }}
      {...rest}
    />
  </Box>
)
