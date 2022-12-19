import { Box, Typography, Button, FormHelperText, Modal, TextField,  FormControl, Grid} from "@mui/material";
import { useEffect, useState } from "react"
import RankSelect from "../RankSelect";
import PositonSelector from "../PositionSelector";
import EligibleMemberCard from "../EligibleMemberCard";
import config from '../../config'
import { dateInfo, timeInfo, returnMemberDetail } from "../../helpers";
const ApiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: 'background.paper',
  borderRadius: '5px',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  overflow: 'scroll',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
};



const FindReplacement = ({ showFindReplacement, shiftSelected, shift, members }) => {
  let [findReplacementOpen, setFindReplacementOpen] = useState(true);
  let [eligibleMembers, setEligibleMembers] = useState([]);

  const handleFindReplacementClose = () => {
    setFindReplacementOpen(false);
    shiftSelected(-1);
  

  }

  const handleSubmit = () =>{
    
  }

  useEffect(() =>{
    setEligibleMembers(members);
  }, []);


  return(
    <Box sx={{overflowY: "scroll"}}>
      <Modal
    open={findReplacementOpen}
    onClose={handleFindReplacementClose}
    
    sx={{ mt:'10vh', overflow:'scroll'}
    }
    
    
    >
      <Box sx={style} >
      
      <Typography sx={{textAlign: 'center', marginBottom: '20px', marginTop:'800px'}} variant="h4" fontWeight='bold'>
          Possible Replacement
        </Typography>
        <Box sx={{display: 'flex', flexDirection: "row", justifyContent: 'space-between', marginBottom: '10px'}}>
        <Typography sx={{textAlign: 'center', marginBottom: '20px'}} variant="h6" >
          for {returnMemberDetail(shift.user_id, members)} on {dateInfo(shift.start_datetime)} at {timeInfo(shift.start_datetime)}
        </Typography>
        

        
      </Box> 
      
      


        <Grid container spacing={2}>
          {eligibleMembers.map((member) => {
            return (
            <Grid item xs={12}>
              <EligibleMemberCard member={member} replacementShift={shift}  />
            </Grid>
            );
        })}
        </Grid>
       
      </Box>
    </Modal>

    </Box>
    
  );


}

export default FindReplacement;