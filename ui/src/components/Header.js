import '../App.css'
import { AppBar, Button, Toolbar, Typography, Box, Tooltip, Modal, Menu, MenuItem} from "@mui/material";
import {useContext, useState} from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Context } from '../App';
import AccountCircle from '@mui/icons-material/AccountCircle';
import EventIcon from '@mui/icons-material/Event';
import HomeIcon from '@mui/icons-material/Home';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import LogoutIcon from '@mui/icons-material/Logout';
import config from '../config'
const ApiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;

const Header = () => {
  const { user, setUser } = useContext(Context);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    setAnchorEl(null);
    let res = await fetch(ApiUrl + '/logout', {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let resJson = await res.json();

    if (res.status !== 202) {
      alert(resJson);
      return;
    }

    setUser(null);
    navigate('/');
  }
  
  return (
    <Box>
      <Box>
        <AppBar position="static" sx={{background: '#242526'}}>
          <Toolbar sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingTop: "10px"}}>
            <Link to={user && user.role === 'member' ? '/member' : '/leader'} style={{ textDecoration: 'none', color: 'white' }}>
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start'}}> 
                <Typography variant="h4" fontWeight="bold">
                  OnDeck
                </Typography>
                <Typography variant="h4" fontWeight="bold" fontSize={40}>
                  <EventIcon fontSize='inherit'/>
                </Typography>
              </div>
            </Link>
            { user ?
            (<>
              <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '-5px'}}>
              <Link to={user && user.role === 'member' ? '/member' : '/leader'} style={{ textDecoration: 'none', color: 'white' }}>
                <Tooltip title="Home">
                  <Typography fontSize={35} sx={{width: '125px', display: 'flex', flexDirection: 'row', justifyContent: 'center', paddingY: '5px', borderRadius: '8px', "&:hover": {backgroundColor: "#3a3b3c",} }}>
                    <HomeIcon fontSize='inherit'/>
                  </Typography>
                </Tooltip>
              </Link>
              <Link to={'/splash'} style={{ textDecoration: 'none', color: 'white' }}>
                <Tooltip title="Shift Overview">
                  <Typography fontSize={35} sx={{ width: '125px', display: 'flex', flexDirection: 'row', justifyContent: 'center', paddingY: '5px', marginX: '5px', borderRadius: '8px', "&:hover": {backgroundColor: "#3a3b3c",}}}>
                    <EqualizerIcon fontSize='inherit'/>
                  </Typography>
                </Tooltip>
              </Link>
              <Link to={'/calendar'} style={{ textDecoration: 'none', color: 'white' }}>
                <Tooltip title="Shift Calendar">
                  <Typography fontSize={35} sx={{width: '125px', display: 'flex', flexDirection: 'row', justifyContent: 'center', paddingY: '5px', borderRadius: '8px', "&:hover": {backgroundColor: "#3a3b3c",}}}>
                    <CalendarMonthIcon fontSize='inherit'/>
                  </Typography>
                </Tooltip>
              </Link>
              
              </Box>
              <Tooltip title="Account">
                <Box onClick={handleClick} sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', borderRadius: '8px', paddingLeft: '10px', paddingTop: '5px', "&:hover": {backgroundColor: "#3a3b3c",}, cursor: 'pointer'}}>
                  <Typography sx={{paddingRight: '5px'}} variant="h6">
                    {user.first_name} {user.last_name}
                  </Typography>
                  <Typography fontSize={25} sx={{paddingRight: '20px'}}>
                    <AccountCircle fontSize='inherit'/>
                  </Typography>
                  {/* <Button color="secondary" variant="contained" onClick={handleLogout}>
                    Logout
                  </Button> */}
                </Box>
              </Tooltip>
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                sx={{borderRadius: '8px'}}
              >
                <MenuItem onClick={handleClose}><SettingsIcon sx={{marginRight: '10px'}}/>Settings & Privacy</MenuItem>
                <MenuItem onClick={handleClose}><HelpOutlineIcon sx={{marginRight: '10px'}}/>Help & Support</MenuItem>
                <MenuItem onClick={handleClose}><NightlightRoundIcon sx={{marginRight: '10px'}}/>Display</MenuItem>
                <MenuItem onClick={handleLogout}><LogoutIcon sx={{marginRight: '10px'}}/>Logout</MenuItem>
              </Menu>
            </>
            ) : null }
          </Toolbar>
        </AppBar>
      </Box>
    </Box>
  );

}

export default Header;