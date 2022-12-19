import { Button, Card, CardActionArea, CardActions, CardContent, CardHeader, Collapse, Stack, Typography } from "@mui/material";
import  { useContext, useEffect, useState } from "react";
import axios from "axios";
import { dateInfo, returnMemberDetail, matchMember } from "../helpers";
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

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


const ApprovalRequestShift = ({ shift, setPending, members }) => {


  let [expanded, setExpanded] = useState(false);
  let [specificMember, setSpecificMember] = useState({});

  useEffect(() => {
    matchMember(members, shift, setSpecificMember);

  }, []);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  }

  const handleApprove = () => {
    console.log('Submit clicked on: ', specificMember.first_name);
    //approve there shift by making a simple
  }

  const handleDeny = () => {
    console.log('Deny clicked for clicked on: ', specificMember.first_name);

  }




  return(
    <Card>
      <CardActions disableSpacing>
        {specificMember.first_name} {specificMember.last_name}
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
            Rank: {specificMember.rank}
          </Typography>

          <Typography mt={1}>
            Crew Position: {specificMember.email}
          </Typography>

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

  )

}



export default ApprovalRequestShift;