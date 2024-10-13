import React, { useState } from 'react';
import './Login.css';
import { FaUser, FaLock } from "react-icons/fa";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../../firebase'; // Import Firebase

function App() {
  return (
    <div className= "wrapper">
        <form action="">
          <h1>Login</h1>
          <div className="input-box">
                <input type="text" placeholder='Username' required/>
                <FaUser className='icon'/>
          </div>
          <div className="input-box">
                <input type="password" placeholder='Password' required/>
                <FaLock className='icon'/>
          </div>
          <div className="remember-forgot">
                <label><input type='checkbox' />Remember me</label>
                <a href='#'>Forgot password?</a>
          </div>

          <button type='submit'>Login</button>

          <div className="register-link">
            <p>Dont have an account? <a href='#'>Register</a></p>
          </div>
          <div className="register-link">
            <p>Log in with google <a href='#'>Google</a></p>
          </div>
        </form>
    </div>
  );
}

export default App;
