import { Button, Card, CardActionArea, CardActions, CardContent, CardHeader, Collapse, Typography, Alert } from "@mui/material";
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { memberString, dateInfo, timeInfo, shiftHelper } from "../helpers";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useEffect, useState } from "react";
import config from "../config";
import Blank from "./Blank";
const ApiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;


const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const EligibleMemberCard = ({ member, replacementShift, allShifts }) => {
  let [expanded, setExpanded] = useState(false);
  let [succesSwap, setSuccessSwap] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  }

  const handleReassign = () => {
    

    const pickUp = async () => {
      try {
        const res = await fetch(ApiUrl + `/time_slots/${replacementShift.id}?assignment_adjusted=true`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({type: 'shift', user_id: member.id}),
        })
        const resJson = await res.json();
  
        if (res.status !== 201) {
          alert(resJson)
          return;
        }

        //toggle refresh
        setSuccessSwap(true);


      } catch(err) {
        console.log(err);
      }
    }
    pickUp();
    
    
  }
  useEffect(() => {
    shiftHelper(member, allShifts)
  })

  return(
    <div className="EligibleMemberCard">
      <Card>
        

        <CardActions disableSpacing>
        {memberString(member)}
          <ExpandMore 
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
          
          

        </CardActions>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
          <Typography mt={1}>
              Phone Number: {member.phone_number}
            </Typography>
            <Typography mt={1}>
              Last Shift: {dateInfo(shiftHelper(member, allShifts).last)}
              {/* Last Shift: {shiftHelper(member, allShifts).last} */}
            </Typography>

            <Typography mt={1}>
            Next Shift: {dateInfo(shiftHelper(member, allShifts).next)}
            </Typography>

            <Typography mt={1}>
              Number of shifts dropped:
            </Typography>

            <Typography mt={1} mb={1}>
              Number of shifts picked up:
            </Typography>
            
            <Button onClick={handleReassign} variant="contained" >Assign to Shift</Button>
          </CardContent>

        {succesSwap ? <Alert severity="success"> Shift Swapped</Alert> : <Blank />}
        </Collapse>

      
      </Card>
    </div>
  )
  


}

export default EligibleMemberCard;