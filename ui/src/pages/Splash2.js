import '../App.css'
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import axios from "axios";
import BarChart2 from "../components/BarChart2";
import PieChart2 from '../components/PieChart2';
import config from '../config';
const ApiUrl = config[process.env.REACT_APP_NODE_ENV || 'development'].apiUrl;
// import Paper from '@mui/material/Paper';

const Splash2 = () => {

    const [shiftData, setShiftData] = useState([]);

    useEffect(() => {

        const getShiftData = async () => {
            try {
                let res = await axios.get(ApiUrl + '/time_slots', { withCredentials: true });
                console.log('Response: ', res.data);
                // let replacementList = res.data.filter(shift => shift.type === 'replacement_needed');
                // setShiftsNeedingReplacements(replacementList);
            } catch (e) {
                console.log('Error fetching shifts needing replacement from a leader profile: ', e);
            }
        }
        getShiftData()
    }, [])


    const navigate = useNavigate();

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

    const sampleShift = [
        { type: 'Shift', area: 12 },
        { type: 'Absent', area: 4 },
        { type: 'Replacement Needed', area: 7 },
        { type: 'Unavailable', area: 5 },
    ];

    return (
        <div className='Splash'>
            <br />
            {/* <h1>Shift Overview</h1> */}
            <br />
            <Grid container spacing={0} justifyContent="center">
                <Grid item xl={7} lg={8} md={8} sm={8}>
                    <PieChart2 data={sampleShift} />
                </Grid>
            </Grid>
            {/* for some reason the piechart disrupts the animation of the next graph, I put an empty invisible one here to resolve the issue */}
            <BarChart2 width={0} />
            <br /> <br />
            <Grid container spacing={6} justifyContent="center">
                <Grid item xl={5} lg={5} md={7} sm={9}>
                    <BarChart2 data={goodBoyData} name="Shifts picked up" color="green" width={600} />
                </Grid>
                <Grid item xl={5} lg={5} md={7} sm={9}>
                    <BarChart2 data={slackerData} name="Shifts dropped" color="darkred" width={600} />
                </Grid>
            </Grid>
            <br />
            <button onClick={() => navigate('/')}>Continue to Profile</button>
            <br /> <br /> <br />
        </div>
    )
}

export default Splash2;