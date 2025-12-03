import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  //Fetch leaderboard data on component mount
  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch('http://localhost:3000/api/leaderboard?n=10');
        const data = await res.json();
        setLeaderboard(data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);
  //Determine current user's rank
  const userRank = user ? leaderboard.findIndex(entry => entry.username === user.username) + 1 : -1;

  return (
    <div>
      <Navbar />
      <h1 style={{ marginTop: '3%', fontSize: '2.5em', textAlign: 'center' }}>Leaderboard</h1>

      {loading ? (
        <h2 style={{ textAlign: 'center' }}>Loading...</h2>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2%' }}>
          <table border="1" cellPadding="12" style={{ borderCollapse: 'collapse', maxWidth: '600px', width: '90%' }}>
            <thead>
              <tr style={{ backgroundColor: '#27292c', color: 'white' }}>
                <th style={{ textAlign: 'left' }}>Rank</th>
                <th style={{ textAlign: 'left' }}>Username</th>
                <th style={{ textAlign: 'right' }}>WPM</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, idx) => {
                const isCurrentUser = user && entry.username === user.username;
                return (
                  <tr
                    key={idx}
                    style={{
                      backgroundColor: isCurrentUser ? 'rgba(100, 200, 100, 0.3)' : 'transparent',
                      borderBottom: '1px solid #ddd',
                    }}
                  >
                    <td style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{idx + 1}</td>
                    <td>{entry.username} {isCurrentUser && <span style={{ marginLeft: '8px', color: 'green', fontWeight: 'bold' }}>★ YOU</span>}</td>
                    <td style={{ textAlign: 'right' }}>{entry.best_wpm}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {user && userRank === -1 && (
        <div style={{ textAlign: 'center', marginTop: '2%', fontSize: '1.1em' }}>
          <p>You are not on the leaderboard yet. Keep typing</p>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
