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

const EligibleMemberCard = ({ member }) => {
  let [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  }

  return(
    <div className="EligibleMemberCard">
      <Card>
        {memberString(member)}

        <CardActions disableSpacing>
          <ExpandMore 
            expand={expanded}
            onClick={handleExpandClick}
          >
            <ExpandMoreIcon />
          </ExpandMore>
          
          

        </CardActions>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            Test content
            <Button>Assign</Button>
          </CardContent>


        </Collapse>
      
      </Card>
    </div>
  )
  


}

export default EligibleMemberCard;