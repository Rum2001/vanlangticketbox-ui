import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/authencations/SignUp';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from './components/authencations/office-365/authConfig';
import Home from './components/page/Home';
import EventsPage from './components/Typography/EventInfo';
import MyEvents from './components/page/MyEvent';
import NavBar from './components/Typography/navbar';
import Footer from './components/Typography/Footer';
import Attendee from './components/page/Attendee';
import ListEvent from './components/Typography/ListEvent';
import Tickets from './components/page/Ticket';
const App = () => {
  

  return (
    <MsalProvider instance={msalInstance}>
      <NavBar />
      <Router>
        <Routes>
          <Route path="/login" Component={Login} />
          <Route path="/home" Component={Home} />
          <Route path="/event/:id" Component={EventsPage} />
          <Route path="/myevent" Component={MyEvents} />
          <Route path="/myevent/delete/:id" Component={MyEvents} />
          <Route path="/myevent/attendee/:id" Component={Attendee} />
          <Route path="/myevent/public/:id" Component={MyEvents} />
          <Route path="/listevent" Component={ListEvent} />
          <Route path="/myevent/ticket" Component={Tickets} />
          <Route path="/myevent/ticket/:id" Component={Tickets} />
        </Routes>
      </Router>
      <Footer/>
    </MsalProvider>
  );
};

export default App;