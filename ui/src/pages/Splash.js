import '../App.css'
import { Context } from '../App';
import { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { Grid, Box, Button, Typography, Card } from "@mui/material";
import BarChart2 from "../components/BarChart2";
import PieChart2 from '../components/PieChart2';
import config from '../config';
const ApiUrl = config[process.env.REACT_APP_NODE_ENV || 'development'].apiUrl;

//FOLLOWING COMMANDS NEEDED FOR GRAPHS TO WORK
// npm i devextreme
// npm i devextreme-react 

// npm i devextreme piechart
// npm i devextreme chart


const Splash = () => {

    const { user } = useContext(Context);
    const [timeSlots, setTimeSlots] = useState([]);
    const [replacementTimeSlots, setReplacementTimeSlots] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);
    const [crewPositions, setCrewPositions] = useState([]);
    const [positionData, setPositionData] = useState([]);
    const [donutData, setDonutData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getTimeSlots = async () => {
            try {
                let res = await fetch(ApiUrl + '/time_slots', { credentials: 'include' });
                let resJson = await res.json();
                if (res.status !== 200) alert(resJson);
                resJson = resJson.filter(slot => slot.type === 'shift').sort((a, b) => new Date(a.start_datetime) - new Date(b.start_datetime));
                setTimeSlots(resJson);

                res = await fetch(ApiUrl + '/time_slots?need_replacement=true', { credentials: 'include' });
                resJson = await res.json();
                if (res.status !== 200) alert(resJson);
                setReplacementTimeSlots(resJson);

                res = await fetch(ApiUrl + '/crew_positions', { credentials: 'include' });
                resJson = await res.json();
                if (res.status !== 200) alert(resJson);
                setCrewPositions(resJson);

                res = await fetch(ApiUrl + '/users', { credentials: 'include' });
                resJson = await res.json();
                if (res.status !== 200) alert(resJson);
                setPositionData(resJson);

            } catch (err) { console.log("fetched failed", err) }
        }
        if (user !== null) getTimeSlots();

    }, [user])

    useEffect(() => {
        const counts = {};
        const donut = [];
        for (const user of positionData) {
            counts[user.crew_position_id] = counts[user.crew_position_id] ? counts[user.crew_position_id] + 1 : 1;
        }
        for (const position of crewPositions) {
            donut.push({type: position.description, area: position.id})
        }
        console.log('donut', donut)
        setDonutData(donut)
    }, [crewPositions, positionData])

    const goodBoyData = [
        { name: "Spc1 Timmy", status: 6 },
        { name: "2d Lt Jackson", status: 5 },
        { name: "Spc2 Tommy", status: 4 },
        { name: "1st Lt Johnson", status: 4 },
        { name: "Spc3 Johnny", status: 3 },
        { name: "SSgt Sally", status: 3 },
    ];

    const slackerData = [
        { name: "Spc1 Timmy", status: 4 },
        { name: "2d Lt Jackson", status: 3 },
        { name: "Spc2 Tommy", status: 3 },
        { name: "1st Lt Johnson", status: 2 },
        { name: "Spc3 Johnny", status: 2 },
        { name: "SSgt Sally", status: 1 },
    ];

    useEffect(() => {
        setPieChartData([
            { type: 'Filled Shifts', area: timeSlots.length },
            { type: 'Replacement Needed', area: replacementTimeSlots.length },
        ])
    }, [timeSlots, replacementTimeSlots])

    return (
        <div className='Splash' >
            {pieChartData.length === 0 && timeSlots.length + replacementTimeSlots.length > 0 ?
                <><Typography variant='h6' align='center'>Loading...</Typography></>
                : <>
                    <Grid container justifyContent="space-between" direction="row" alignItems="baseline" sx={{ marginTop: '20px', marginBottom: '20px' }}>
                        <Button size="small" variant='contained' sx={{ marginLeft: '40px' }} onClick={() => navigate('/member')}>Return to Profile</Button>
                        <Typography variant='h4' fontWeight='bold'>Shift Overview</Typography>
                        <Box sx={{ width: 200 }}></Box>
                    </Grid>

                    <Card sx={{ marginLeft: '40px', marginRight: '40px' }}>
                        <Grid container direction="row" justifyContent="space-evenly" sx={{ marginTop: '20px' }}>
                            <Grid item xl={7} lg={8} md={8} sm={8}>
                                <PieChart2 data={pieChartData} />
                            </Grid>
                            <Grid item xl={7} lg={8} md={8} sm={8}>
                                <PieChart2 data={donutData} />
                            </Grid>
                        </Grid>

                        <Grid container direction="row" justifyContent="space-evenly">
                            <Grid item xl={5} lg={5} md={7} sm={9}>
                                <BarChart2 data={goodBoyData} name="Shifts picked up" color="green" width={525} />
                            </Grid>
                            <Grid item xl={5} lg={5} md={7} sm={9}>
                                <BarChart2 data={slackerData} name="Shifts dropped" color="darkred" width={525} />
                            </Grid>
                        </Grid>
                        <br /> <br />
                    </Card>
                    <br /> <br />
                </>}
        </div>
    )
}

export default Splash;