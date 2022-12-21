import { Card, CardActionArea, CardContent, Typography, Container, Grid } from "@mui/material";
import  { useContext, useEffect, useState } from "react";
import axios from "axios";
import { dateInfo, returnMemberDetail } from "../helpers";

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import HailIcon from '@mui/icons-material/Hail';

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "DEC"];

const cardStyle = {
  bgcolor:"#929aab"
}



const ReplacementShift = ({ replacementRequest, crewPositions, membersRequesting, memberList, setShift }) => {
  let test = new Date(replacementRequest.start_datetime);

  useEffect(() => {

  }, [])

  if(crewPositions[replacementRequest.crew_position_id -1] === undefined){
    return (<p>loading...</p>)
  }
  else{
    return(
      <Container>
        <Card  elevation={6} sx={{borderRadius:"8px"}}>
        <CardActionArea onClick={(e) => setShift(replacementRequest)}>
        <CardContent >
          <Grid container direction="row" alignItems="center">
            <Grid item>
            <CalendarMonthIcon></CalendarMonthIcon>
            </Grid>
            <Grid item>
            <Typography  ml={1}>
            {dateInfo(replacementRequest.start_datetime)}
          </Typography>
  
            </Grid>
          </Grid>
  
          <Grid container direction="row" alignItems="center" mt={1}>
            <Grid item>
            <MilitaryTechIcon />
            </Grid>
            <Grid item>
            <Typography  >
            <Typography ml={1}> {crewPositions[replacementRequest.crew_position_id -1].name} </Typography>
          </Typography>
  
            </Grid>
          </Grid>
  
          <Grid container direction="row" alignItems="center" mt={1}>
            <Grid item>
            <EmojiPeopleIcon />
            </Grid>
            <Grid item>
            <Typography  >
            <Typography ml={1}> {returnMemberDetail(replacementRequest.user_id, memberList)} </Typography>
          </Typography>
  
            </Grid>
          </Grid>
          
          
          
            
            
          
          
        </CardContent>
  
        </CardActionArea>
        
      </Card>
  
      </Container>
      
  
    )

  }

  

}

export default ReplacementShift;