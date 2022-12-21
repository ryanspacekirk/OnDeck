import { Button, Container, Typography } from '@mui/material';
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MenuItem, Select, Box, Grid, Item, Card, Paper } from "@mui/material";
import { Context } from '../App';
import axios, { all } from "axios";
import '../App.css';
import { doubleFilter, generateOverview, memberCurrentlyAvailable, leaderPending, filterPending } from '../helpers';
import ReplacementShift from '../components/ReplacementShift';
import FindReplacement from '../components/modals/FindReplacement';
import Blank from '../components/Blank';
import ApprovalRequest from '../components/ApprovalRequest';
import ApprovalRequestShift from '../components/ApprovalRequestShift';
import config from '../config';
import { Stack } from '@mui/system';
const ApiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;



const themeColors = {
  background:"#f7f7f7",
  cardsOffBackground: "#eeeeee",
  darkContrast: "#393e46",
  lightDarkContrast:"#929aab"

}

const buttonStyle = {
  val:1,

};

const paperStyled = {
  bgcolor: "#f7f7f7"

  
}

const cardStyle = {
  bgcolor:"#929aab"
}



const LeaderProfile = () => {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  let [shiftsNeedingReplacements, setShiftsNeedingReplacements] = useState([]);
  let [crewPositions, setCrewPositions] = useState([]);
  let [memberList, setMemberList] = useState([]);
  let [membersRequesting, setMembersRequesting] = useState([]);
  let [overviewData, setOverivewData] = useState({numCommander: -1, numSVO: -1, numGSO: -1, numCommanderAvail: -1, numSVOAvail: -1, numGSOAvail: -1});

  let [shiftSelected, setShiftSelected] = useState(-1);
  let [showFindReplacement, setShowFindReplacement] = useState(false);

  let [leadersPending, setLeadersPending] = useState([]);
  let [approvalsPending, setApprovalsPending] = useState([]);
  let [allShifts, setAllShifts] = useState([]);

  let [adjustedShifts, setAdjustedShifts] = useState([]);

  //reroutes if user doesn't have access
  useEffect(() => {
    if (user !== null) {
        if (user.role !== 'leader') navigate('/accessDenied')
      }
    const getShiftsNeedingReplacements = async () =>{
      try{
      let res = await axios.get(ApiUrl + '/time_slots', {withCredentials:true});
      setAllShifts(res.data);
      
      let replacementList = res.data.filter(shift => shift.type === 'replacement_needed');
      setShiftsNeedingReplacements(replacementList);
                

      } catch (e) {
        console.log('Error finding crew positions LeaderProfile:', e);

      }
    }

    const getCrewPositions = async () => {
      try {
        let res = await axios.get(ApiUrl + '/crew_positions', { withCredentials: true });
        setCrewPositions(res.data);


      } catch (e) {
        console.log('Error finding crew positions LeaderProfile:', e);

      }

    }
    getCrewPositions();

    getShiftsNeedingReplacements();


    const getMembers = async () => {
      try {
        let res = await axios.get(ApiUrl + '/users?member', { withCredentials: true });
        setMemberList(res.data);
      } catch (e) {
        console.log('Error finding members  in LeaderProfile:', e);

      }
    }
    getMembers();

    //Need to pull all the items awaiting for approval

    const getSwappedShifts = async () => {
      try{
        let res = await axios.get(ApiUrl + '/adjusted_shifts', { withCredentials: true });
        setAdjustedShifts(res.data);

      }catch(e){
        console.log('Error finding swapped shifts  in LeaderProfile:', e);
      }

    }
        //Need to pull all the items awaiting for approval
        generateOverview(memberList, setOverivewData, allShifts);
        getSwappedShifts();
        
        
    }, []);

  useEffect(() => {
    generateOverview(memberList, setOverivewData, allShifts);

    leaderPending(memberList, setLeadersPending);

    //shiftspendings

    filterPending(allShifts, setApprovalsPending);



  }, [memberList])

  useEffect(() => {

    if (shiftSelected !== -1) {
      setShowFindReplacement(true);

    }
    else {
      setShowFindReplacement(false);
    }
    




  }, [shiftSelected]);

  //Use effect that is called any time there is an update to the shift list from the server
  useEffect(() => {


    let replacementList = allShifts.filter(shift => shift.type === 'replacement_needed');
    setShiftsNeedingReplacements(replacementList);
    filterPending(allShifts, setApprovalsPending);
    leaderPending(memberList, setLeadersPending);

    //all shifts have been updated. Need to see how many of a certain crew type are available

    }, [allShifts]);




  useEffect(() => {
      const getMembersNeedingReplacements = async () => {
        try{
          let res = await axios.get(ApiUrl + '/users?member', {withCredentials:true});
          setMemberList(res.data);

          let memberList = await doubleFilter(res.data, shiftsNeedingReplacements);
          setMembersRequesting(memberList);

        } catch(e){
          console.log('Error finding members needing replacements in LeaderProfile:', e);
        }       
      }
      getMembersNeedingReplacements();
      //memberCurrentlyAvailable(memberList[1]);

    }, [shiftsNeedingReplacements]);


  return (
      <div className='LeaderProfile'>
        <Paper sx={{bgcolor:"#f7f7f7"}}>
        <Container>
          <Box>
          
          <Box>
            <Grid container spacing={2} mt={2}>
              <Grid item xs={4}>
                <Card sx={cardStyle} elevation={4} > <Typography   variant='h6' align='center'> Total Commanders:</Typography> <Typography   variant='h4' align="center">{overviewData.numCommander}</Typography></Card>
              </Grid>
              <Grid item xs={4}>
                <Card sx={cardStyle} elevation={4} > <Typography align='center' variant='h6'> Total SVOs:</Typography> <Typography align='center' variant='h4'>{overviewData.numSVO}</Typography></Card> 
              </Grid>
              <Grid item xs={4}>
                <Card elevation={4} sx={cardStyle}> <Typography align='center' variant='h6'> Total GSOs:</Typography> <Typography align='center' variant='h4'>{overviewData.numGSO}</Typography></Card>
              </Grid>
              <Grid item xs={4}>
                <Card elevation={6} sx={cardStyle}> <Typography  align='center' variant='h6'> Currently Available:</Typography> <Typography align='center' variant='h4'>{overviewData.numCommanderAvail}</Typography></Card>
              </Grid>
              <Grid item xs={4}>
                <Card elevation={6} sx={cardStyle}> <Typography align='center' variant='h6'> Currently Available:</Typography> <Typography align='center' variant='h4'>{overviewData.numSVOAvail}</Typography></Card>
              </Grid>
              <Grid item xs={4}>
                <Card elevation={6} sx={cardStyle}><Typography align='center' variant='h6'> Currently Available:</Typography> <Typography align='center' variant='h4'>{overviewData.numGSOAvail}</Typography></Card>
              </Grid>
            </Grid>
          </Box>
          <Grid container spacing={6} mt={2}>
            <Grid item xs={6} >
              <Paper elevation={4} sx={{bgcolor:"#eeeeee"}}>
                <Box><Typography variant='h4' align='center' > Leadership Input Required</Typography></Box>
              
              <Box>
              <Grid container spacing={2} mt={2}>
                {leadersPending.map((leader) => {
                  return(
                    <Grid item xs={6}>
                      <ApprovalRequest  key={leader} leader={leader} setMembers={setMemberList}/>
                    </Grid>
                  );
                })}
                
              </Grid>


              </Box>
              
              <Box pb={10}>
              <Grid container spacing={2} mt={2}>
                {approvalsPending.map((shift) => {
                  return(
                    <Grid item xs={6}>
                      <ApprovalRequestShift key={shift} shift={shift} setPending={setApprovalsPending} members={memberList} roles={crewPositions} setShifts={setAllShifts}/>
                    </Grid>
                  );
                })}
                
              </Grid>

              </Box>
              

              </Paper>
              
              </Grid>

                {/* Right side of the display */}
              <Grid item xs={6}>
                <Paper elevation={4} sx={{bgcolor:"#eeeeee"}}>
                <Typography variant='h4' align='center'>Shifts Waiting to be Filled</Typography>
                <Box pb={10}>
                <Grid container spacing={2} mt={2}>
                {shiftsNeedingReplacements.map(shift => {
                  return(
                    <Grid item xs={6} >
                      <ReplacementShift key={shift} replacementRequest={shift} crewPositions={crewPositions} membersRequesting={membersRequesting} memberList={memberList} setShift={setShiftSelected} />
                    </Grid>
                  )
                })} 
            </Grid>

                </Box>
              

                </Paper>
                
            </Grid>
          </Grid>          
          </Box>
          {showFindReplacement ? <FindReplacement key={shiftSelected.id} showFindReplacement={setShowFindReplacement} shiftSelected={setShiftSelected} shift={shiftSelected}   members={memberList} shifts={allShifts} setShifts={setAllShifts} adjusted={adjustedShifts}/> : <Blank />}
            

        </Container>
        <Stack direction="row"   spacing={60} mt={2}>
          <Button variant="outlined" onClick={(e) => {navigate('/calendar')}}>Calendar</Button>
          <Button variant="outlined" onClick={(e) => {navigate('/splash')}}>Overview</Button>
          <Button variant="outlined" onClick={(e) => {navigate('/alpha_roster')}}>Alpha Roster</Button>
        </Stack>

        </Paper>
        


        </div>
    )
}

export default LeaderProfile;