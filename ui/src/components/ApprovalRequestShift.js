import { Button, Card, CardActionArea, CardActions, CardContent, CardHeader, Collapse, Stack, Typography, Container, Box } from "@mui/material";
import  { useContext, useEffect, useState } from "react";
import axios from "axios";
import { dateInfo, returnMemberDetail, matchMember } from "../helpers";
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Blank from "./Blank";

import config from '../config';
const ApiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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

const cardStyle = {
  bgcolor:"#929aab"
}


const ApprovalRequestShift = ({ shift, setPending, members, roles, setShifts }) => {


  let [expanded, setExpanded] = useState(false);
  let [specificMember, setSpecificMember] = useState({});

  useEffect(() => {
    matchMember(members, shift, setSpecificMember);
    

  }, []);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  }

  const handleApprove = () => {

    const approveRequest = async () => {
      let slotBody = shift;
      slotBody.type = "replacement_needed";
      try{
        let res = await axios.patch(ApiUrl + `/time_slots/${shift.id}`, slotBody, {withCredentials:true});
      let updatedShifts = await axios.get(ApiUrl + '/time_slots', {withCredentials:true});
      setShifts(updatedShifts.data);

      } catch(e){
        console.log('Error with approving request  in ApprovalRequestShift.js', e);
      }
      

    }
    approveRequest();

    //approve there shift by making a simple
  }

  const handleDeny = () => {
    

    const denyRequest = async () => {
      let slotBody = shift;
      slotBody.type = "shift";
      try{
        let res = await axios.patch(ApiUrl + `/time_slots/${shift.id}`, slotBody, {withCredentials:true});
      let updatedShifts = await axios.get(ApiUrl + '/time_slots', {withCredentials:true});
      setShifts(updatedShifts.data);

      } catch(e){
        console.log('Error with denying request  in ApprovalRequestShift.js', e);

      }
      

    }
    denyRequest();

  }


if(members[shift.user_id -1] === undefined){
  return (<Blank/>)
}
else{
  return(
    <Box >
      <Container >
      
      <Card  elevation={6}>
      <CardActions disableSpacing>
        {members[shift.user_id -1].first_name} {members[shift.user_id -1].last_name}
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
            Requesting to find a replacement for their upcomming shift on {dateInfo(shift.start_datetime)}.
          </Typography>

          <Typography mt={1}>
            Rank: {members[shift.user_id -1].rank}
          </Typography>

          {roles[0] === undefined ?
          <Typography mt={1}>
          Crew Position
        </Typography>
        :
        <Typography mt={1}>
            Crew Position: {roles[shift.crew_position_id -1].name}
            
          </Typography>
          }

          

          <Typography mt={1} mb={1}>
            Date Submitted: {dateInfo(shift.updated_at)}
          </Typography>

          <Stack direction='row' spacing={2} mt={2}>
            <Button onClick={handleApprove}  variant="contained" color="success">Approve</Button>
            <Button onClick={handleDeny}  variant="contained" color="error">Deny</Button>

          </Stack>
          
          
        </CardContent>
      </Collapse>
      
      
    </Card>

    </Container>

    </Box>

    
    

  )

}

  

}



export default ApprovalRequestShift;