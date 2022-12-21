import { Context } from '../App';
import { useContext, useEffect, useState } from "react"
import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import config from '../config'
import { TimeSlot } from '../components/TimeSlot';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';

const ApiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;


const Member = () => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [timeSlots, setTimeSlots] = useState([]);
  const [replacementTimeSlots, setReplacementTimeSlots] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [crewPosition, setCrewPosition] = useState(null)

  const toggleRefresh = () => {
    setRefresh(!refresh);
  }

  const shiftOverview = () => {
    navigate('/splash')
  }

  const calendar = () => {
    navigate('/calendar')
  }

  useEffect(() => {
    if (user !== null) {
      if (user.role === 'leader') navigate('/leader')
    }
  }, [user, navigate])

  useEffect(() => {
    const getTimeSlots = async () => {
      try {
        let res = await fetch(ApiUrl + '/time_slots', {
          credentials: 'include'
        });
        let resJson = await res.json();

        if (res.status !== 200) {
          alert(resJson);
        }

        resJson = resJson.filter(slot => slot.type === 'shift').sort((a, b) => new Date(a.start_datetime) - new Date(b.start_datetime));

        setTimeSlots(resJson);

        res = await fetch(ApiUrl + '/time_slots?need_replacement=true', {
          credentials: 'include'
        });
        resJson = await res.json();

        if (res.status !== 200) {
          alert(resJson);
        }
        
        let tempReplaceTimeSlots = resJson.filter(shift => shift.crew_position_id === user.crew_position_id);

        setReplacementTimeSlots(tempReplaceTimeSlots);

        res = await fetch(ApiUrl + `/crew_positions/${user.crew_position_id}`)
        resJson = await res.json();
        setCrewPosition(resJson[0]['name']);


      } catch (err) {
        console.log(err);
      }
    }
    if (user !== null) {
      getTimeSlots();
    }
  }, [user, refresh])

  return (
    <div style={{ display: 'flex', flexDirection: "row", justifyContent: 'space-evenly', marginTop: '20px', textAlign: 'center' }}>
      {user === null ? <><Typography variant='h6' align='center' sx={{ marginTop: '20px' }}>Loading...</Typography></>
        : <>
          <Box width={700} sx={{ marginTop: '20px' }}>
            <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginBottom: '20px', background: '#242526', borderRadius: '8px', paddingBottom: '20px' }}>
              <CardMedia
                sx={{ height: 400 }}
                image="/satellite.jpg"
              />
              <CardContent sx={{marginTop: '-70px'}}>
                <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                  <Typography fontSize={150} sx={{marginRight: '10px'}}><AccountCircle fontSize='inherit'sx={{background: '#242526', borderRadius: '100px'}} /></Typography>
                  <Box sx={{marginTop: '-25px'}}>
                    <Typography variant='h4' fontWeight='bold'>{user ? user.first_name + " " + user.last_name : null}</Typography>
                    <Typography variant="h6" sx={{color: '#e4e6eb', marginLeft: '-70px'}}>Crew Position: {crewPosition}</Typography>
                  </Box>
                </Box>
                <Box sx={{background: '#3a3b3c', borderRadius: '8px', marginTop: '-50px', paddingY: '15px'}}>
                  <Typography variant="h6">Account Info: </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <Typography><span style={{ fontWeight: 'bold' }}><MilitaryTechIcon fontSize='inherit' sx={{marginRight: '5px', marginBottom: '-2px'}}/>Rank:</span> {user ? user.rank : null}</Typography>
                    <Typography><span style={{ fontWeight: 'bold' }}><PersonIcon fontSize='inherit' sx={{marginRight: '5px', marginBottom: '-2px'}}/>Role:</span> {user ? user.role : null}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <Typography><span style={{ fontWeight: 'bold' }}><EmailIcon fontSize='inherit' sx={{marginRight: '5px', marginBottom: '-2px'}}/>Email:</span> {user ? user.email : null}</Typography>
                    <Typography><span style={{ fontWeight: 'bold' }}><LocalPhoneIcon fontSize='inherit' sx={{marginRight: '5px', marginBottom: '-2px'}}/>Phone Number:</span>{user ? user.phone_number : null}</Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardActions sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <Button size="large" variant='contained' onClick={shiftOverview} sx={{backgroundColor: '#1da1f2', color: 'white'}}><EqualizerIcon sx={{marginRight: '10px'}}/>See Shift Overview</Button>
                <Button size="large" variant='contained' onClick={calendar} sx={{backgroundColor: '#1da1f2', color: 'white'}}><CalendarMonthIcon sx={{marginRight: '10px'}}/>See Calendar</Button>
              </CardActions>
            </Card>
          </Box>
          <Box width={340} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Typography variant='h4' fontWeight='bold' sx={{ marginBottom: '20px' }}>
              My Shifts
            </Typography>
            <Box>
              {timeSlots.map(slot => <TimeSlot key={slot.id} slot={slot} toggleRefresh={toggleRefresh} />)}
            </Box>
          </Box >
            <Box width={340} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <Typography variant='h4' fontWeight='bold' sx={{ marginBottom: '20px' }}>
                Available Shifts
              </Typography>
              {replacementTimeSlots.map(slot => <TimeSlot key={slot.id} slot={slot} type={"replacement"} toggleRefresh={toggleRefresh} />)}
            </Box>
        
        </>}
    </div>
  )
}

export default Member;