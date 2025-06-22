import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import Profile from './pages/Profile';
import About from './pages/About';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import PrivRoute from './components/PrivRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';

export default function App() {
  return (
    <>
      <Header />
     <Routes>
  <Route path='/' element={<Home />} />
  <Route path='/sign-in' element={<SignIn />} />
  <Route path='/sign-up' element={<SignUp />} />
  <Route path='/about' element={<About />} />
  <Route path='/listing/:listingId' element={<Listing />} />
  <Route path='/search' element={<Search/>}/>

  {/* Protected Routes */}
  <Route element={<PrivRoute />}>
    <Route path='/profile' element={<Profile />} />
    <Route path='/create-listing' element={<CreateListing/>} />
    <Route path='/profile/update-listing/:listingId' element={<UpdateListing/>} />
  </Route>
</Routes>

    </>
  );
}
