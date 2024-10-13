import React, { useState } from 'react';
import './Login.css';
import { FaUser, FaLock } from "react-icons/fa";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../../firebase'; // Import Firebase

function App() {
  return (
<div className= "columns">
    <div className= "wrapper">
        <form action="">
          <h1>User-1</h1>

          <div className="input-box">
                <input type="text" placeholder='....Input' required/>
          </div>


          <button type='submit'>Submit Prompt</button>



        </form>
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
          <h1>AI</h1>
          <div className="input-box">
                <input type="text" placeholder='AI JUDGING .....' required/>
          </div>
        </form>
    </div>

</div>



    <div className= "wrapper">
        <form action="">
          <h1>User-2</h1>

          <div className="input-box">
                <input type="text" placeholder='....Input' required/>
          </div>


          <button type='submit'>Submit Prompt</button>



        </form>
    </div>
</div>

    
  );
}

export default App;
