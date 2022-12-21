import { Card, CardActionArea, CardContent, Typography, Container, Grid } from "@mui/material";
import  { useContext, useEffect, useState } from "react";
import axios from "axios";
import { dateInfo, returnMemberDetail } from "../helpers";

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "DEC"];

const cardStyle = {
  bgcolor:"#929aab"
}



const ReplacementShift = ({ replacementRequest, crewPositions, membersRequesting, memberList, setShift }) => {
  let test = new Date(replacementRequest.start_datetime);

  useEffect(() => {

  }, [])


  return(
    <Container>
      <Card  elevation={6} >
      <CardActionArea onClick={(e) => setShift(replacementRequest)}>
      <CardContent >
        <Grid container direction="row" alignItems="center">
          <Grid item>
          <CalendarMonthIcon></CalendarMonthIcon>
          </Grid>
          <Grid item>
          <Typography  >
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
          <Typography> {crewPositions[replacementRequest.crew_position_id -1].name} </Typography>
        </Typography>

          </Grid>
        </Grid>
        
        
        
          {crewPositions[0] === undefined ?
          <Typography>Shift Crew Position:</Typography>
          :
          <Typography> Shift Crew Position: {crewPositions[replacementRequest.crew_position_id -1].name} </Typography>
          }
          
        
        <Typography>
          Member needing replacement: {returnMemberDetail(replacementRequest.user_id, memberList)}
        </Typography>
      </CardContent>

      </CardActionArea>
      
    </Card>

    </Container>
    

  )

}

export default ReplacementShift;