import { Button, Card, CardActionArea, CardActions, CardContent, CardHeader, Collapse, Stack, Typography } from "@mui/material";
import  { useContext, useEffect, useState } from "react";
import axios from "axios";
import { dateInfo, returnMemberDetail } from "../helpers";
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

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


const ApprovalRequest = () => {

  let [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  }

  const handleApprove = () => {
    console.log('Request Approved');

  }

  const handleDeny = () => {
    console.log('Request Denied');
  }

  return(
    <Card>
      <CardActions disableSpacing>
        Member membersRequesting
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
            Request Type:
          </Typography>

          <Typography mt={1}>
            Request Start:
          </Typography>

          <Typography mt={1}>
            Request End:
          </Typography>

          <Typography mt={1} mb={1}>
            Supporting Information:
          </Typography>

          <Stack direction='row' spacing={2} mt={2}>
            <Button onClick={handleApprove} variant="contained" color="success">Approve</Button>
            <Button onClick={handleDeny} variant="contained" color="error">Deny</Button>

          </Stack>
          
          
        </CardContent>
      </Collapse>
      
      
    </Card>

  )

  


}

export default ApprovalRequest;