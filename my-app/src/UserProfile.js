// src/components/UserProfile.js
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust the path as necessary

function UserProfile({ userId }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', userId); // Assuming your collection is named 'users'
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          setError('No such user found!');
        }
      } catch (err) {
        setError('Error fetching user data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <p><strong>Display Name:</strong> {userData.displayName}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Games Played:</strong> {userData.gamesPlayed.join(', ')}</p>
      <p><strong>Loss Count:</strong> {userData.lossCount}</p>
      <p><strong>Win Count:</strong> {userData.winCount}</p>
      {/* Avoid displaying password in production */}
      <p><strong>Password:</strong> {userData.password}</p>
    </div>
  );
}

export default UserProfile;
