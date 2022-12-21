import { Box, Button, Card, CardActions, CardContent, Typography } from '@mui/material'
import React, { useContext } from 'react'
import { Context } from '../App';
import config from '../config'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
const ApiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;

export const TimeSlot = ({ slot, type, toggleRefresh }) => {
  const { user } = useContext(Context);
  const start = new Date(slot.start_datetime.replace(' ', 'T'));
  const end = new Date(slot.end_datetime.replace(' ', 'T'));

  const handlePickUp = () => {
    const pickUp = async () => {
      try {
        const res = await fetch(ApiUrl + `/time_slots/${slot.id}?assignment_adjusted=true`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({type: 'shift', user_id: user.id}),
        })
        const resJson = await res.json();
  
        if (res.status !== 201) {
          alert(resJson)
          return;
        }

        toggleRefresh();
      } catch(err) {
        console.log(err);
      }
    }
    pickUp();
  }

  const handleReplacement = () => {
    const replace = async () => {
      try {
        const res = await fetch(ApiUrl + `/time_slots/${slot.id}`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({type: 'pending_replacement', user_id: user.id}),
        })
        const resJson = await res.json();
  
        if (res.status !== 201) {
          alert(resJson)
          return;
        }
        alert('Your request to drop this shift is now pending leadership approval. You will be notified of your leadership\'s the decision upon approval.')
        toggleRefresh();
      } catch(err) {
        console.log(err);
      }
    }
    replace();
  }

  return (
    <Card sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginBottom: '30px', background: type === 'replacement' ? '#3a3b3c' : '#242526', borderRadius: '8px',  paddingLeft: '20px', paddingRight: '20px', width: '340px'}}>
      <CardContent>
        <Typography variant="h5" fontWeight='bold'><CalendarMonthIcon fontSize='inherit' sx={{marginBottom: '-2px', marginRight: '2px'}}/>{start.toDateString().slice(4, 15)}</Typography>
        <Typography variant="h6" sx={{marginBottom: '20px'}} fontWeight='bold'><AccessTimeIcon fontSize='inherit' sx={{marginBottom: '-2px', marginRight: '4px'}}/>{start.toTimeString().slice(0,5)} - {end.toTimeString().slice(0,5)}</Typography>
        <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <Typography><span style={{fontWeight: 'bold'}}>Crew Position:</span> {slot.name} </Typography>
        </Box>

        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
          <Typography><span style={{fontWeight: 'bold'}}>Description:</span> {slot.description} </Typography>
        </Box>
      </CardContent>
      <hr style={{width: '100%'}}/>
      <CardActions sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
        { type === 'replacement' ?
          <Typography onClick={handlePickUp} fontWeight='bold' sx={{cursor: 'pointer', width: '100%', paddingY: '10px', marginTop: '-10px', borderRadius: '8px', "&:hover": {backgroundColor: "#242526",}}}>PICK UP SHIFT</Typography> :
          <Typography onClick={handleReplacement} fontWeight='bold' sx={{cursor: 'pointer', width: '100%', paddingY: '10px', marginTop: '-10px', borderRadius: '8px', "&:hover": {backgroundColor: "#3a3b3c",}}}>I CAN'T MAKE IT</Typography>
        }
        
        
      </CardActions>
    </Card>
    
  )
}
