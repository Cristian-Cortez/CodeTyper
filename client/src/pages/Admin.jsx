import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

function Admin() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const user = (() => { //get current user
        try {
            const stored = localStorage.getItem('user');
            return stored ? JSON.parse(stored) : null;
        } catch (e) { return null; }
    })();

  useEffect(() => {
    fetchUsers();
  }, []);
  //Called on load
  async function fetchUsers() {
    setLoading(true);
    setError(null);
    try {
        const adminId = user?.id;
        const res = await fetch(`http://localhost:3000/api/users?adminId=${adminId}`);
        if (!res.ok) {
            const txt = await res.text();
            throw new Error(txt || 'Failed to fetch');
        }
        const data = await res.json();
        setUsers(data);
    } catch (err) {
        console.error(err);
        setError(err.message || 'Error');
    } finally {
        setLoading(false);
    }
  }
  //delete user button clicked
  async function handleDelete(id) {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try {
      const adminId = user?.id;
      const res = await fetch(`http://localhost:3000/api/users/${id}?adminId=${adminId}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      await res.json();
      setUsers((s) => s.filter(u => u.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete user');
    }
  }

  return (
    <div>
      <Navbar />
      <div style={{ padding: 20 }}>
        <h1>Admin — Users</h1>
        {loading ? <p>Loading...</p> : null}
        {error ? <p style={{ color: 'red' }}>{error}</p> : null}
        {!loading && !error && (
          <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead style={{ backgroundColor: '#27292c', color: 'white' }}>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Name</th>
                <th>Best WPM</th>
                <th>Admin</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.first_name} {u.last_name}</td>
                  <td>{u.best_wpm ?? 0}</td>
                  <td>{(u.isadmin ?? u.is_admin) ? 'Yes' : 'No'}</td>
                  <td>
                    <button onClick={() => handleDelete(u.id)} disabled={u.id === user?.id}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Admin;
