import React from 'react'
import { InputBase, InputBaseProps } from '@mui/material'
import { SearchRounded } from '@mui/icons-material'

interface TournamentSearchProps extends InputBaseProps {}

export const TournamentSearch: React.FC<TournamentSearchProps> = ({
  ...rest
}) => (
  <InputBase
    placeholder="Search tournaments"
    startAdornment={<SearchRounded />}
    sx={{ width: '100%' }}
    {...rest}
  />
)
