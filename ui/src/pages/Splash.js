import '../App.css'
import { Context } from '../App';
import { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { Grid, Box, Button, Typography, Card } from "@mui/material";
import BarChart from "../components/BarChart";
import PieGraph from '../components/PieGraph';
import config from '../config';
const ApiUrl = config[process.env.REACT_APP_NODE_ENV || 'development'].apiUrl;

const Splash = () => {

    const { user } = useContext(Context);
    const [timeSlots, setTimeSlots] = useState([]);
    const [replacementTimeSlots, setReplacementTimeSlots] = useState([]);
    const [pendingTimeSlots, setPendingTimeSlots] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);
    const [crewPositions, setCrewPositions] = useState([]);
    const [positionData, setPositionData] = useState([]);
    const [donutData, setDonutData] = useState([]);
    const navigate = useNavigate();

    //fetches for all information to be displayed
    useEffect(() => {
        const getTimeSlots = async () => {
            try {
                let res = await fetch(ApiUrl + '/time_slots_splash', { credentials: 'include' });
                let resJson = await res.json();
                if (res.status !== 200) alert(resJson);
                const shiftCount = {};
                for (const shift of resJson) {
                    shiftCount[shift] = shiftCount[shift] ? shiftCount[shift] + 1 : 1
                }
                setTimeSlots(shiftCount.shift);
                setPendingTimeSlots(shiftCount.pending_replacement);
                setReplacementTimeSlots(shiftCount.replacement_needed);

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

    //sets crew position data
    useEffect(() => {
        const counts = {};
        const donut = [];
        for (const user of positionData) {
            counts[user.crew_position_id] = counts[user.crew_position_id] ? counts[user.crew_position_id] + 1 : 1;
        }
        for (const position of crewPositions) {
            donut.push({ type: position.description, area: position.id })
        }
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

    // sets shift data
    useEffect(() => {
        setPieChartData([
            { type: 'Filled Shifts', area: timeSlots },
            { type: 'Replacement Needed', area: replacementTimeSlots },
            { type: 'Drop Request Pending', area: pendingTimeSlots },
        ])
    }, [timeSlots, replacementTimeSlots, pendingTimeSlots])

    // makes return function wait until data has loaded
    function render() {
        return (
            pieChartData.length === 0 ||
            timeSlots + replacementTimeSlots + pendingTimeSlots === 0 ||
            donutData.length === 0
        )
    }

    return (
        <div className='Splash' >
            {render() ? <><Typography variant='h6' align='center' sx={{ marginTop: '20px' }}>Loading...</Typography></>
                : <>
                    <Grid container justifyContent="space-between" direction="row" alignItems="baseline" sx={{ marginTop: '20px', marginBottom: '20px' }}>
                        <Button size="small" variant='contained' sx={{ marginLeft: '40px' }} onClick={() => navigate('/member')}>Return to Profile</Button>
                        <Typography variant='h4' fontWeight='bold'>Shift Overview</Typography>
                        <Box sx={{ width: 200 }}></Box>
                    </Grid>

                    <Card sx={{ marginLeft: '40px', marginRight: '40px' }}>
                        <Grid container direction="row" justifyContent="space-evenly" sx={{ marginTop: '20px' }}>
                            <Grid item xl={5} lg={5} md={7} sm={9}>
                                <PieGraph data={pieChartData} type={"pie"} palette={["#73d47f", "#fb7764", "#fed85e"]} />
                            </Grid>
                            <Grid item xl={5} lg={5} md={7} sm={9}>
                                <PieGraph data={donutData} type={"donut"} palette={"office"} />
                            </Grid>
                        </Grid>

                        <Grid container direction="row" justifyContent="space-evenly">
                            <Grid item xl={5} lg={5} md={7} sm={9}>
                                <BarChart data={goodBoyData} name="Shifts picked up" color="green" width={525} />
                            </Grid>
                            <Grid item xl={5} lg={5} md={7} sm={9}>
                                <BarChart data={slackerData} name="Shifts dropped" color="darkred" width={525} />
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