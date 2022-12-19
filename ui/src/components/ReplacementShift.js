import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import  { useContext, useEffect, useState } from "react";
import axios from "axios";
import { dateInfo, returnMemberDetail } from "../helpers";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];



const ReplacementShift = ({ replacementRequest, crewPositions, membersRequesting, memberList, setShift }) => {
  let test = new Date(replacementRequest.start_datetime);

  useEffect(() => {

  }, [])


  return(
    <Card>
      <CardActionArea onClick={(e) => setShift(replacementRequest)}>
      <CardContent >
        <Typography>
          Shift Date: {dateInfo(replacementRequest.start_datetime)}
        </Typography>
        
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

  )

}

export default ReplacementShift;