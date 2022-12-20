import { ConstructionOutlined } from "@mui/icons-material";
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

export const generateOverview = (members, overviewSetter, allShifts) => {
  

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

  //find number of crew memembers that are not working the next 24 hour period
  let tempDay = new Date();
  
  tempData.numCommanderAvail =  generateNumReplacements(tempDay, members, 1, allShifts);
  
  
  tempData.numSVOAvail =  generateNumReplacements(tempDay, members, 2, allShifts);
  tempData.numGSOAvail =  generateNumReplacements(tempDay, members, 3, allShifts);

  






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
  let  returnValue = false;
  
  
  if(shiftList[0] !== undefined){
    

    shiftList.forEach((shift) => {
      let workedShiftTime = new Date(shift.start_datetime);
      let timeBetwenShifts = shiftDate - workedShiftTime;
      if((timeBetwenShifts > 0) && (timeBetwenShifts < dayMili)){
        
        returnValue = true;
      }
      
    })

  }

  
  return returnValue;
  
  
}

const workNext24 = (shiftList, shiftDate) => {
  let returnValue = false;

  
 
  if(shiftList[0] !== undefined){
    

    shiftList.forEach((shift) => {
      let workedShiftTime = new Date(shift.start_datetime);
      let timeBetwenShifts = workedShiftTime - shiftDate;
      
      if((timeBetwenShifts > 0) && (timeBetwenShifts < dayMili)){
        
        returnValue = true;
      }
      
    })

  }
  
  return returnValue;

}


export const findPossibleReplacements =  (shift, members, setEligibleMembers, shifts) => {
  
  
  let shiftDate = new Date(shift.start_datetime);
  let timeEligible = [];
  let positionEligible = members.filter(member  => member.crew_position_id === shift.crew_position_id);  
  positionEligible.forEach((member => {
    let thisMemberShifts = shifts.filter((individualShift) => individualShift.user_id === member.id);

    let didWorkLast24 = false;
    let didWorkNext24 = false;
      
    didWorkLast24 =  workPast24(thisMemberShifts, shiftDate);
    didWorkNext24 =  workNext24(thisMemberShifts, shiftDate);

    if(!didWorkLast24 && !didWorkNext24){
      
      timeEligible.push(member);
    }
    
    //1. Check the last time they worked. If it is within 24 hours of the shift starting they are not eligible
    //2. if they are free 24 hours before... make sure they don't have a shift starting in the next 24 hours

  }))
  setEligibleMembers(timeEligible);

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
      next: new Date(memberShifts[memberShifts.length - 1].start_datetime),
      last: new Date(memberShifts[0].start_datetime),
    };
    let curTime = new Date();
    
  
    memberShifts.forEach((shift) => {
      let shiftTime = new Date(shift.start_datetime);
      if(((shiftTime - elf.last) > 0 ) && ((curTime - shiftTime) > 0)){//execute if there was a shift more recently
        elf.last = shiftTime;

      }

      if(((elf.next - shiftTime) > 0 ) && ((shiftTime - curTime) > 0)){//execute if there was a shift more recently
        elf.next = shiftTime;

      }
    })
    
    
    return elf;

  }
  
  
}



export const generateNumReplacements =  (shiftDate, members, postionID, shifts) => {
  
  
  let timeEligible = [];
  
  let positionEligible = members.filter(member  => member.crew_position_id === postionID);

  positionEligible.forEach((member => {
    //for each member that matches the shifts crew position id
    let thisMemberShifts = shifts.filter((individualShift) => individualShift.user_id === member.id);
    
    let didWorkLast24 = false;
    let didWorkNext24 = false;
      
    didWorkLast24 =  workPast24(thisMemberShifts, shiftDate);
    didWorkNext24 =  workNext24(thisMemberShifts, shiftDate);

    if(!didWorkLast24 && !didWorkNext24){
      
      timeEligible.push(member);
    }
    
    
    
    // let returnVal = timeEligible.length;
    

    
    
    
    //1. Check the last time they worked. If it is within 24 hours of the shift starting they are not eligible
    //2. if they are free 24 hours before... make sure they don't have a shift starting in the next 24 hours

  }));
  return timeEligible.length;

}