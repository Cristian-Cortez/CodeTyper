import {useState, useEffect} from 'react'
import TypingGameComponent from '../components/TypingGameComponent'
import Navbar from '../components/Navbar'


function Profile() {
  const h2Style = {
    marginTop: '1%',
    marginLeft: '7%',
    textAlign: 'left'
  }
  return (
    <div>
      <Navbar/>
      <h1 style={{marginTop: '3%'}}>First Name Last Name</h1>
      <h2 style={h2Style}>Favorite word: </h2>
      <h2 style={h2Style}> Best WPM: </h2>
    </div>
  )
   
}

export default Profile;
