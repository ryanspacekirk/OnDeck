import { Button, Card, CardActionArea, CardActions, CardContent, CardHeader, Collapse, Stack, Typography, Container, Box } from "@mui/material";
import  { useContext, useEffect, useState } from "react";
import axios from "axios";
import { dateInfo, returnMemberDetail } from "../helpers";
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

const cardStyle = {
  bgcolor:"#929aab"
}


const ApprovalRequest = ({ leader, setMembers }) => {
  

  let [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  }

  const handleApprove = () => {

    const upgradeLeader = async () => {
      let leaderBody = leader;
      leaderBody.role = "leader";
      try{
        let res = await axios.patch(ApiUrl + `/users/${leader.id}`, leaderBody, {withCredentials:true});
      let newMemberList = await axios.get(ApiUrl + '/users?member', {withCredentials:true});
      setMembers(newMemberList.data);


      } catch (e){
        console.log('Error with upgrading leader in ApprovalRequest.js', e);

      }
      
      

    }
    upgradeLeader();
    
    

  }

  const handleDeny = () => {
    

    const downgradeLeader = async () => {
      let memberBody = leader;
      memberBody.role = "member";
      try{
        let res = await axios.patch(ApiUrl + `/users/${leader.id}`, memberBody, {withCredentials:true});
      let newMemberList = await axios.get(ApiUrl + '/users?member', {withCredentials:true});
      setMembers(newMemberList.data);

      } catch (e){
        console.log('Error with downgrading leader in ApprovalRequest.js', e);
        

      }
      
    }
    downgradeLeader();


  }

  useEffect(() => {
    

  }, []);

  return(
    <Container >
      <Box>
      <Card  elevation={6}>
      <CardActions disableSpacing>
        {leader.first_name} {leader.last_name}
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
            Requesting to be assigned as a member of the leadership team.
          </Typography>

          <Typography mt={1}>
            Rank: {leader.rank}
          </Typography>

          <Typography mt={1}>
            Email: {leader.email}
          </Typography>

          <Typography mt={1} mb={1}>
            Date Submitted: {dateInfo(leader.updated_at)}
          </Typography>

          <Stack direction='row' spacing={2} mt={2}>
            <Button onClick={handleApprove} variant="contained" color="success">Approve</Button>
            <Button onClick={handleDeny} variant="contained" color="error">Deny</Button>

          </Stack>
          
          
        </CardContent>
      </Collapse>
      
      
    </Card>

      </Box>
      

    </Container>
    

  )

  


}

export default ApprovalRequest;