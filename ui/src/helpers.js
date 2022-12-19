import axios from "axios";
import config from './config';
const ApiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const dateInfo = (isoDate) => {
  
  let tempDate = new Date(isoDate);
  let returnInfo = days[tempDate.getDay()] + ', ' + tempDate.getDate() + ', ' + months[tempDate.getMonth()];
  
  return returnInfo;
}

export const timeInfo = (isoDate) => {
  let tempDate = new Date(isoDate);
  return tempDate.toTimeString();

}

export const returnMemberDetail = (memberID, memberList) => {
  let tempMember = memberList.filter((member) => member.id === memberID);
  if(tempMember[0] === undefined){
    return '_';
  }
  else{
    return(tempMember[0].last_name + ', ' + tempMember[0].first_name + ` (${tempMember[0].rank})` );
  }
}

export const memberString = (member) => {
  return(member.last_name + ', ' + member.first_name + ` (${member.rank})` );
}

export const doubleFilter = async(members, shifts) => {
  let tempList = [];
  

  shifts.forEach((shift) => {
    members.forEach((member) => {
       if(member.id === shift.user_id){
        tempList.push(member);
       }
    })
  })


  
  return tempList;
}

export const generateOverview = (members, overviewSetter) => {

  let tempData = {
    numCommander: -1,
    numSVO: -1,
    numGSO: -1,
    numCommanderAvail: -1,
    numSVOAvail: -1,
    numGSOAvail: -1
  };


  tempData.numCommander = members.filter(member => member.crew_position_id === 1).length;
  tempData.numSVO = members.filter(member => member.crew_position_id === 2).length;
  tempData.numGSO = members.filter(member => member.crew_position_id === 3).length;

  overviewSetter(tempData);

}

export const memberCurrentlyAvailable = async(member) => {
  //get all the time slots associated with that user
  console.log('Member ID @ member currently available:', member.id)

  try{
    let res = await axios.get(ApiUrl + `/time_slotsbyid?user_id=${member.id}`, {withCredentials:true});
    console.log('Member specific timeslots', res.data);
    
              


    } catch (e) {
      console.log('Error finding crew positions for a specific id LeaderProfile:', e);

    }






}

export const leaderPending = async (memberList, setLeadersPending) =>{
  let leadersNeedingApproval = [];

  leadersNeedingApproval = memberList.filter((member) => member.role === 'pending' );
  console.log('People needing approval:', leadersNeedingApproval);
  setLeadersPending(leadersNeedingApproval);

}

export const filterPending = async (all, setPending) => {
  let shiftsNeedignApproval = [];
  shiftsNeedignApproval = all.filter((shift) => shift.type === "pending_replacement");
  setPending(shiftsNeedignApproval);

}

export const matchMember = async (memebrs, shift, setMemebr) => {
  let returnMember;
  memebrs.forEach((member) => {
    if(shift.user_id === member.id){
      returnMember = member;
    }
  });
  setMemebr(returnMember);
}