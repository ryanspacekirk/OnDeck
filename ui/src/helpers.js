import axios from "axios";
import config from './config';
const ApiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dayMili = 86400000;
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
  

  try{
    let res = await axios.get(ApiUrl + `/time_slotsbyid?user_id=${member.id}`, {withCredentials:true});
    
    
              


    } catch (e) {
      console.log('Error finding crew positions for a specific id LeaderProfile:', e);

    }






}

export const leaderPending = async (memberList, setLeadersPending) =>{
  let leadersNeedingApproval = [];

  leadersNeedingApproval = memberList.filter((member) => member.role === 'pending' );
  
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

const workPast24 = (shiftList, shiftDate) => {
  shiftList.forEach((shift) => {
    let workedShiftTime = new Date(shift.start_datetime);
    if((shiftDate - workedShiftTime) > dayMili){
      //did not work in the past 24 hours
      
      return false;
    }
    else{
      return true;
    }
    
  })
  
}

const workNext24 = (shiftList, shiftDate) => {
  shiftList.forEach((shift) => {
    let nextShiftTime = new Date(shift.start_datetime);
    if((nextShiftTime - shiftDate) > dayMili ){
      return false;
    }
    else{
      return true;
    }
  })

}


export const findPossibleReplacements = async (shift, members, setEligibleMembers, shifts) => {
  let shiftDate = new Date(shift.start_datetime);
  let timeEligible = [];
  
  let positionEligible = members.filter(member  => member.crew_position_id === shift.crew_position_id);
  
  //filter by time;
  positionEligible.forEach((member => {
    //for each member that matches the shifts crew position id
    let thisMemberShifts = shifts.filter((individualShift) => individualShift.user_id === member.id);
    if(workPast24(thisMemberShifts, shiftDate)){
      //member did work in the last 24 hours
    }
    else{
      if(workNext24(thisMemberShifts, shiftDate)){
        //They do work in the next 24 hours
      }
      else{
        //they dont work the next 24 hours
        timeEligible.push(member);
      }
    }
    
    setEligibleMembers(timeEligible);
    //1. Check the last time they worked. If it is within 24 hours of the shift starting they are not eligible
    //2. if they are free 24 hours before... make sure they don't have a shift starting in the next 24 hours

  }))

}

export const shiftHelper = (member, shifts) => {
  let memberShifts = shifts.filter((shift) => member.id === shift.user_id);
  
  if(memberShifts[0] === undefined){
    let elf = {
      next: "None Found",
      last: "None Found"
    };

    return elf;

  }
  else{
    let elf = {
      next: new Date(memberShifts[0].start_datetime),
      last: new Date(memberShifts[0].start_datetime),
    };
    let curTime = new Date();
    console.log('Before Loop Current Time:', curTime)
    console.log('Before Loop Elf:', elf)
  
    memberShifts.forEach((shift) => {
      let shiftTime = new Date(shift.start_datetime)
      if((curTime - shiftTime) > 0){// Shift happened in the past
        if(shiftTime > elf.last){
          elf.last = shiftTime;
        }
  
      } else{// Shift is happening in the future
        if(shiftTime < elf.next){
          elf.next = shiftTime;
        }
  
  
      }
      
    })
    
    console.log('After Loop Elf:', elf)
    return elf;

  }
  
  
}