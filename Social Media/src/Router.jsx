import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';


import Signup from './components/SignUp/SignUp';
import SignIn from './components/SignIn/SignIn';
import FeedHeader from './components/FeedHeader';

import PostCard from './components/PostCard';
import ProfilePage from './components/ProfilePage';
import ProfileEdit from './components/ProfileEdit'
import PostCreate from './components/PostCreate';

export default function Router() {
  return (
    <BrowserRouter>
   
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path='/register' element={<Signup/>}/>
      <Route path='/login' element={<SignIn/>}/>
      <Route path='/feedheader' element={<FeedHeader/>}/>
      <Route path='/profile' element={<ProfilePage/>}/>
      <Route path='/postcard' element={<PostCard/>}/>
      <Route path='/edit' element={<ProfileEdit/>} />
      <Route path='/create' element={<PostCreate/>} />
        </Routes>
    
    </BrowserRouter>
  );
}
