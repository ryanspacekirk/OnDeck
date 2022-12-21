import { DataGrid } from '@mui/x-data-grid';
import { Button, Card, Container, Typography } from '@mui/material';
import { useContext, useEffect, useState } from "react";
import config from '../config';
import axios, { all } from "axios";
const ApiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;

const columns = [
  {field: 'id', headerName: 'ID', width: 60},
  {field: "first_name", headerName: "First Name", width: 180},
  {field: "last_name", headerName: "Last Name", width: 180},
  {field: "rank", headerName: "Rank", width: 180},
  {field: "role", headerName:"Role", width: 80},
  {field: "crew_position_id", headerName:"Crew Position", width: 180},
  {field: "phone_number", headerName:"Phone Number", width: 180},

]
let rows = [{
  id:1,
  first_name:"Test",
  last_name:"Dummy",
  role:"Leader"
  },{id:2,
  first_name:"Test",
  last_name:"Dummy",
  position:"test",
  role:"Leader"
  }]

const AlphaRoster = () => {
  let [memberList, setMemberList] = useState([]);
  let [gridList, setGridList] = useState([]);

  const makeGridList = () => {
    let tempGridList = [];
    memberList.forEach((member) => {
      let tempMember = member;
      if(tempMember.crew_position_id === 1){
        tempMember.crew_position_id = "Commander"
      }
      else if(tempMember.crew_position_id === 2){
        tempMember.crew_position_id = "SVO"
      }
      else{
        tempMember.crew_position_id = "GSO"
      }
      tempGridList.push(tempMember);
    });
    setGridList(tempGridList);
  }

  useEffect(() => {
    const getMembers = async () => {
      try {
        let res = await axios.get(ApiUrl + '/users?member', { withCredentials: true });
        setMemberList(res.data);
      } catch (e) {
        console.log('Error finding members  in LeaderProfile:', e);

      }
    }
    getMembers();
    

  },[]);



  useEffect(()=>{
    rows = memberList;
    
    rows = memberList;

    makeGridList();

  }, [memberList])

  
  return(
    
    <div className="AlphaRoster" >
      <Container>
      <div className='ROSTERDIV' style={{height:800 }}>
      <DataGrid
          columns={columns}
          rows={gridList}
          pageSize={13}
          
          checkboxSelection
          
          >
            </DataGrid>

      </div>

      </Container>
      
      
      
      

      


    </div>

  )
}

export default AlphaRoster;