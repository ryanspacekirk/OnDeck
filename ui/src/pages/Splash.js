import '../App.css'
import { Context } from '../App';
import { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { Grid, Box, Button, Typography, Card } from "@mui/material";
import axios from "axios";
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

    //ryan additions below this line
    const [memberList, setMemberList] = useState([]);
    const [adjustedShifts, setAdjustedShifts] = useState([]);
    const [goodBoyData, setGoodBoyData] = useState([]);
    const [slackerData, setSlackerData] = useState([]);

    // fetches information for bar graphes
    useEffect(() => {
        const getMembers = async () => {
            try {
                let res = await axios.get(ApiUrl + '/users?member', { withCredentials: true });
                setMemberList(res.data);
            } catch (e) {
                console.log('Error finding members  in Splash:', e);
            }
        }
        getMembers();

        const getSwappedShifts = async () => {
            try {
                let res = await axios.get(ApiUrl + '/adjusted_shifts', { withCredentials: true });
                setAdjustedShifts(res.data);
            } catch (e) {
                console.log('Error finding swapped shifts  in LeaderProfile:', e);
            }
        }
        getSwappedShifts();
    }, []);

    // generates bar graph data
    useEffect(() => {
        if (memberList.length > 0 && adjustedShifts.length > 0) {
            const counts = {};
            let tempGoodBoyData = [];

            for (const shift of adjustedShifts) {
                counts[shift.added_member_id] = counts[shift.added_member_id] ? counts[shift.added_member_id] + 1 : 1;
            }
            let keysSorted = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a] });

            for (let i = 0; i < 5; i++) {
                let memberId = keysSorted[i]

                tempGoodBoyData.push({ name: memberList[parseInt(memberId) - 1].first_name, status: counts[memberId] });
            }
            setGoodBoyData(tempGoodBoyData);

            const counts2 = {};
            let tempSlackerData = [];

            for (const shift of adjustedShifts) {
                counts2[shift.removed_member_id] = counts2[shift.removed_member_id] ? counts2[shift.removed_member_id] + 1 : 1;
            }
            let keysSorted2 = Object.keys(counts2).sort(function (a, b) { return counts2[b] - counts2[a] });
            
            for (let i = 0; i < 5; i++) {
                let memberId = keysSorted2[i]

                tempSlackerData.push({ name: memberList[parseInt(memberId) - 1].first_name, status: counts2[memberId] });
            }
            setSlackerData(tempSlackerData);
        }
    }, [memberList, adjustedShifts]);

    //fetches for piechart and donut chart information to be displayed
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

    //generates crew position donut chart data
    useEffect(() => {
        const counts = {};
        const donut = [];
        for (const user of positionData) {
            counts[user.crew_position_id] = counts[user.crew_position_id] ? counts[user.crew_position_id] + 1 : 1;
        }
        for (const position of crewPositions) {
            donut.push({ type: position.description, area: counts[position.id] })
        }
        setDonutData(donut)
    }, [crewPositions, positionData])

    // generates shift pie chart data
    useEffect(() => {
        setPieChartData([
            { type: 'Filled Shifts', area: timeSlots },
            { type: 'Replacement Needed', area: replacementTimeSlots },
            { type: 'Drop Request Pending', area: pendingTimeSlots },
        ])
    }, [timeSlots, replacementTimeSlots, pendingTimeSlots])

    // return function WAITS until data has loaded
    function render() {
        return (
            pieChartData.length === 0 ||
            timeSlots + replacementTimeSlots + pendingTimeSlots === 0 ||
            donutData.length === 0 ||
            memberList.length === 0 ||
            adjustedShifts.length === 0
        )
    }

    return (
        <div className='Splash' >
            {render() ? <><Typography variant='h6' align='center' sx={{ marginTop: '20px' }}>Loading...</Typography></>
                : <>
                    <Grid container justifyContent="space-between" direction="row" alignItems="baseline" sx={{ marginTop: '20px', marginBottom: '20px' }}>
                        {/* <Button size="small" variant='contained' sx={{ marginLeft: '40px' }} onClick={() => navigate('/member')}>Return to Profile</Button> */}
                        <Typography variant='h4' fontWeight='bold' color="white">Shift Overview</Typography>
                        {/* <Box sx={{ width: 200 }}></Box> */}
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