import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Splash2 from './pages/Splash2';
// import CrewProfile from './pages/CrewProfile';
// import LeaderProfile from './pages/LeaderProfile';
import Header from './components/Header';
import Calendar from './pages/Calendar';
import Member from './pages/Member';
import LeaderProfile from './pages/LeaderProfile';
import './App.css'
import { Pending } from './pages/Pending';
import config from './config'
const ApiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;

function App() {
  let [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const res = await fetch(ApiUrl + '/refresh', {
        credentials: "include"
      });
      const session = await res.json();

      if (session.user) {
        setUser(session.user);
      } 
    }
    getUser();
  }, [])

  return (
    <div className='App'>
      <Context.Provider value={{ user, setUser }}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/member" element={<Member />} />
            <Route path="/leader" element={<LeaderProfile />} />
            <Route path="/splash" element={<Splash2 />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/pending" element={<Pending />} />
            {/* <Route path="/crewProfile" element={<CrewProfile />} />
            <Route path="/leaderProfile" element={<LeaderProfile />} /> */}
          </Routes>
        </BrowserRouter>
      </Context.Provider>
    </div>


  );
}

export default App;

export const Context = React.createContext();
