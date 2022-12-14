import { Paper, Container, Box, Typography, Button, Stack, Modal, TextField, Alert, FormControl, MenuItem, Select, CircularProgress } from "@mui/material";
import { useState, useEffect, useContext } from "react"
import axios from "axios";
import RankSelect from "../RankSelect";
import { Context } from '../../App';
import Blank from "../Blank";

const loginStyle = {
    postion: 'absolute',
    width: '50%',
    bgcolor: 'background.paper',
    margin: 'auto',
    
}

const handleCreateAccount = (account, setLoading) => {
    console.log('Account Information:', account);
    setLoading(true);

    setTimeout(() => {
        setLoading(false);
    }, 1000);

}



const CreateAccount = ({ showCreate }) => {
    const { authenticatedUser, setAuthenticatedUser } = useContext(Context);
    
    const handleAccountCLose = () => {
        setCreateAccountOpen(false);
        showCreate(false);
    }
    const [createAccountOpen, setCreateAccountOpen] = useState(true);
    const [createLoading, setCreateLoading] = useState(false);

    const [account, setAccount] = useState({
        firstName:"",
        lastName:"",
        phoneNum:"",
        email:"",
        rank:"",
        username:"",
        password:""
    });
 
    const [create_firstName, setCreate_firstName] = useState("");
    const [create_lastName, setCreate_lastName] = useState("");
    const [create_phoneNum, setCreate_phoneNum] = useState("");
    const [create_email, setCreate_email] = useState("");
    const [create_rank, setCreate_rank] = useState("");
    const [create_username, setCreate_username] = useState("");
    const [create_password, setCreate_password] = useState("");



    useEffect(() => {//component did mount
        setCreateAccountOpen(true);

    }, [])

    useEffect(() => {
        setAccount({
            firstName:create_firstName,
            lastName:create_lastName,
            phoneNum:create_phoneNum,
            email:create_email,
            rank:create_rank,
            username:create_username,
            password:create_password

        })

    }, [create_firstName, create_lastName, create_phoneNum, create_email, create_rank, create_username, create_password])

    return(
        <Modal
        open={createAccountOpen}
        onClose={handleAccountCLose}
        >
            <Box>
                <Typography>
                    Log in to account below
                </Typography>   

                <Stack justifyContent="center" spacing={4}>
                    <FormControl  variant="filled" sx={loginStyle}>
                        <TextField disabled={createLoading} onChange={(e) => {setCreate_firstName(e.target.value)}} id="first-name" variant="outlined" label="First Name"></TextField>
                        <TextField disabled={createLoading} onChange={(e) => {setCreate_lastName(e.target.value)}} id="last-name" variant="outlined" label="Last Name"></TextField>
                        <TextField disabled={createLoading} onChange={(e) => {setCreate_phoneNum(e.target.value)}} id="phone-num" variant="outlined" label="Phone Num"></TextField>
                        <TextField disabled={createLoading} onChange={(e) => {setCreate_email(e.target.value)}} id="email" variant="outlined" label="email"></TextField>
                        <RankSelect disabled={createLoading} setRank={setCreate_rank} />
                        <TextField disabled={createLoading} onChange={(e) => {setCreate_username(e.target.value)}} id="username" variant="outlined" label="username"></TextField>
                        <TextField disabled={createLoading} onChange={(e) => {setCreate_password(e.target.value)}} id="password" variant="outlined" label="password"></TextField>
                        
                        <Button onClick={(e) => handleCreateAccount(account, setCreateLoading)}>CREATE ACCOUNT</Button>
                    </FormControl>
                    

                </Stack>
                {createLoading ? <CircularProgress /> : <Blank/>}

            </Box>



        </Modal>

    );


}

export default CreateAccount;