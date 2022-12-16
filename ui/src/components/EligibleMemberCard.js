import { Button, Card, CardActionArea, CardActions, CardContent, CardHeader, Collapse, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { memberString, dateInfo, timeInfo } from "../helpers";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useState } from "react";


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

const EligibleMemberCard = ({ member, replacementShift }) => {
  let [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  }

  const handleReassign = () => {
    console.log('Reassignment activated');
    console.log('Assigned: ', memberString(member), ' to ', replacementShift);
    
  }

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
            Test content
            <Button onClick={handleReassign}>Assign</Button>
          </CardContent>


        </Collapse>
      
      </Card>
    </div>
  )
  


}

export default EligibleMemberCard;