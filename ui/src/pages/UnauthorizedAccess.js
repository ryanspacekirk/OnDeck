import { Grid, Button, Typography,  } from "@mui/material";
import { useNavigate } from 'react-router';

const UnauthorizedAccess = () => {

    const navigate = useNavigate();
    // navigate('/accessDenied')

    return (
        <div className='unauthorizedAccess'>
            <Grid container alignContent='center' direction="column" alignItems="center" sx={{ marginTop: '70px', marginBottom: '20px' }}>
                <Typography variant='h3' fontWeight='bold'>Access denied</Typography>
                <Typography variant='h7' sx={{ marginTop: '20px' }}>You don't have permissions to access this page.</Typography>
                <Typography variant='h7'>Contact an administrator or go to the home page and browse other pages.</Typography>
                <Typography variant='h7'></Typography>
                <Button size="small" variant='contained' sx={{ marginTop: '50px' }} onClick={() => navigate('/')}>Go to home</Button>
            </Grid>
        </div>
    )
}

export default UnauthorizedAccess;