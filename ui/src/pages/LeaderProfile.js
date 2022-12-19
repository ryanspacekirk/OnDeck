import { Container, Typography } from '@mui/material';
import  { useContext, useEffect, useState } from "react";
import { MenuItem, Select, Box, Grid, Item, Card } from "@mui/material";
import { Context } from '../App';
import axios from "axios";
import '../App.css';
import { doubleFilter, generateOverview, memberCurrentlyAvailable } from '../helpers';
import ReplacementShift from '../components/ReplacementShift';
import FindReplacement from '../components/modals/FindReplacement';
import Blank from '../components/Blank';
import ApprovalRequest from '../components/ApprovalRequest';
import config from '../config';
const ApiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;







const LeaderProfile = () => {
  const { user } = useContext(Context);
  let [shiftsNeedingReplacements, setShiftsNeedingReplacements] = useState([]);
  let [crewPositions, setCrewPositions] = useState([]);
  let [memberList, setMemberList] = useState([]);
  let [membersRequesting, setMembersRequesting] = useState([]);
  let [overviewData, setOverivewData] = useState({
    numCommander: -1,
    numSVO: -1,
    numGSO: -1,
    numCommanderAvail: -1,
    numSVOAvail: -1,
    numGSOAvail: -1
  });

  let [shiftSelected, setShiftSelected] = useState(-1);
  let [showFindReplacement, setShowFindReplacement] = useState(false);

  useEffect(() => {
    const getShiftsNeedingReplacements = async () =>{
      try{
      let res = await axios.get(ApiUrl + '/time_slots', {withCredentials:true});
      
      let replacementList = res.data.filter(shift => shift.type === 'replacement_needed');
      setShiftsNeedingReplacements(replacementList);
                


      } catch (e) {
        console.log('Error finding crew positions LeaderProfile:', e);

      }
    }

    const getCrewPositions = async () => {
        try{
          let res = await axios.get(ApiUrl + '/crew_positions', {withCredentials:true});
          setCrewPositions(res.data);


        } catch (e) {
          console.log('Error finding crew positions LeaderProfile:', e);
    
        }
    
        }
          getCrewPositions();

        getShiftsNeedingReplacements();

        const getMembers = async () => {
          try{
            let res = await axios.get(ApiUrl + '/users?member', {withCredentials:true});
            setMemberList(res.data);
          } catch(e){
            console.log('Error finding members  in LeaderProfile:', e);
  
          }
        }
        getMembers();

        //Need to pull all the items awaiting for approval
        



        
    }, []);

    useEffect(()=>{
      generateOverview(memberList, setOverivewData);


    }, [memberList])

    useEffect(() => {
      console.log('Shift Triggered');
      console.log('Shift selected: ', shiftSelected);
      if(shiftSelected !== -1){
        setShowFindReplacement(true);

      }
      else{
        setShowFindReplacement(false);
      }
      
      


    }, [shiftSelected])


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
      memberCurrentlyAvailable(memberList[1]);




    }, [shiftsNeedingReplacements]);


    return (
      <div className='LeaderProfile'>
        <Container>
          <Box>
          <Typography>Shifts that need to be filled!</Typography>
          <Box>
            <Grid container spacing={2} >
              <Grid item xs={4}>
                <Card> Total # of commanders {overviewData.numCommander}</Card>
              </Grid>
              <Grid item xs={4}>
                <Card> Total # of SVOs {overviewData.numSVO}</Card>
              </Grid>
              <Grid item xs={4}>
                <Card> Total # of GSOs {overviewData.numGSO}</Card>
              </Grid>

              <Grid item xs={4}>
                <Card> Total # of commanders currently avaialable {overviewData.numCommander}</Card>
              </Grid>
              <Grid item xs={4}>
                <Card> Total # of SVOs currently avaialable {overviewData.numSVO}</Card>
              </Grid>
              <Grid item xs={4}>
                <Card> Total # of GSOs currently avaialable {overviewData.numGSO}</Card>
              </Grid>
            </Grid>
          </Box>
          <Grid container spacing={6} mt={2}>
            <Grid item xs={6} >
              <Card>
                <p>Leadership input required</p>
              </Card>
              <Grid container spacing={2} mt={2}>
                <Grid item xs={6}>
                  <ApprovalRequest />
                </Grid>
                <Grid item xs={6}>
                <ApprovalRequest />
                </Grid>
                {/* Items needing approval... need to map through all the items */}
                
              </Grid>
              </Grid>

              

              <Grid item xs={6}>
              <Card>
                <p>Shifts waiting to be filled</p>
              </Card>

              <Grid container spacing={2} mt={2}>
                {shiftsNeedingReplacements.map(shift => {
                  return(
                    <Grid item xs={6} >
                      <ReplacementShift replacementRequest={shift} crewPositions={crewPositions} membersRequesting={membersRequesting} memberList={memberList} setShift={setShiftSelected} />
                    </Grid>
                  )
                  
                })} 
                
              
            </Grid>
            </Grid>


          </Grid>
            

            
          </Box>
          {showFindReplacement ? <FindReplacement showFindReplacement={setShowFindReplacement} shiftSelected={setShiftSelected} shift={shiftSelected}   members={memberList}/> : <Blank />}
            

        </Container>

        </div>
    )
}

export default LeaderProfile;