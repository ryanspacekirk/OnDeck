import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Splash from './pages/Splash';
import Header from './components/Header';
import Calendar from './pages/Calendar';
import Member from './pages/Member';
import LeaderProfile from './pages/LeaderProfile';
import UnauthorizedAccess from './pages/UnauthorizedAccess';
import AlphaRoster from './pages/AlphaRoster';
import './App.css'
import { Pending } from './pages/Pending';
import Redirect from './components/Redirect';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  let [user, setUser] = useState(null);

  return (
    <div className='App'>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Context.Provider value={{ user, setUser }}>
          <BrowserRouter>
            <Header />
            <Redirect />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/member" element={<Member />} />
              <Route path="/leader" element={<LeaderProfile />} />
              <Route path="/splash" element={<Splash />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/pending" element={<Pending />} />
              <Route path="/accessDenied" element={<UnauthorizedAccess />} />
              <Route path="/alpha_roster" element={<AlphaRoster />} />
            </Routes>
          </BrowserRouter>
        </Context.Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;

export const Context = React.createContext();
