import { Typography } from '@mui/material'
import React, { useContext } from 'react'
import { Context } from '../App'

export const Pending = () => {
  const { user } = useContext(Context);
  return (
    <div>
      <Typography variant="h4" sx={{width: '70%', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto', marginTop: '100px'}}>
        Hello {user.first_name}! You recently requested a leadership account. A current leader must approve your request before receive access to OnDeck. You will receive a notification when you're request is approved.
      </Typography>
    </div>
  )
}
