import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react';

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const h2Style = {
    marginTop: '1%',
    marginLeft: '7%',
    textAlign: 'left'
  };

  if (!user) {
    return (
      <div>
        <Navbar/>
        <h1 style={{marginTop: '3%'}}>Not logged in</h1>
      </div>
    );
  }

  return (
    <div>
      <Navbar/>
      <h1 style={{marginTop: '3%'}}>
        {user.first_name} {user.last_name}
      </h1>
      <h2 style={h2Style}>Favorite word: {user.favorite_word || 'None yet'}</h2>
      <h2 style={h2Style}>Best WPM: {user.best_wpm ?? '0'}</h2>
    </div>
  );
}

export default Profile;
