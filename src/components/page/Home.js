import { useMsal } from '@azure/msal-react';
import { logout } from '../authencations/office-365/authConfig';
import NavBar from '../Typography/navbar';
import Hero from '../Typography/hero';
import Footer from '../Typography/Footer';
import CreateEvent from '../Typography/CreateEV';
import TopEvent from '../Typography/TopEvent';
import Future from '../Typography/Future';
import Categories from '../Typography/Categories';
import AddEvent from '../Typography/AddEvent';
const Home = () => {
  return (
    <div>
      <Hero />
      <AddEvent/>
      <TopEvent />
      <Categories/>
    </div>
  );
};

export default Home;