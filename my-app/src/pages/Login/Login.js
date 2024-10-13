import React, { useState } from 'react';
import './Login.css';
import { FaUser, FaLock } from "react-icons/fa";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../../firebase'; // Import Firebase

function App() {
  return (

// Game structure
<div className= "columns">
<div className="rows">
    <div className= "wrapper">
        <form action="">
          <h1>Defendant2</h1>
          <div className="input-box">
          <textarea placeholder="Your text here"></textarea>
          </div>
          <button type='submit'>Submit argument</button>
        </form>
    </div>

    <div className= "wrapper">
        <form action="">
          <div className="input-bo">
                <p>Timer Component will go here</p>
          </div>
        </form>
    </div>

</div>

<div class= "rows">
    <div className= "wrapper">
        <form action="">
          <div className="input-bo">
                <p>The debate prompt given to both users</p>
          </div>
        </form>
    </div>
    <div className= "wrapper">
        <form action="">
          <h1>AIJudge</h1>
          <div className="input-box">
          <textarea placeholder="judging................"></textarea>
          </div>
        </form>
    </div>
    <div className= "wrapper">
        <form action="">
          <div className="input-bo">
                <p>Turn count</p>
          </div>
        </form>
    </div>

</div>


<div className="rows">
    <div className= "wrapper">
        <form action="">
          <h1>Defendant</h1>

          <div className="input-box">
          <textarea placeholder="Your text here"></textarea>
          </div>


          <button type='submit'>Submit argument</button>



        </form>
    </div>
    <div className= "wrapper">
        <form action="">
          <div className="input-bo">
                <p>Timer Component will go here</p>
          </div>
        </form>
    </div>
    </div>
</div>

    
  );
}

export default App;
