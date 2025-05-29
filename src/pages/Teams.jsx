import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const API = import.meta.env.VITE_API_URL;

  const headers = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await axios.get(`${API}/teams`, headers);
      setTeams(res.data);
    } catch {
      toast.error('Failed to load teams');
    }
  };

  const createTeam = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/teams`, form, headers);
      toast.success("Team created");
      setForm({ name: '', description: '' });
      fetchTeams();
    } catch (err) {
      toast.error("Team creation failed");
    }
  };

  const requestJoin = async (teamId) => {
    try {
      await axios.post(`${API}/teams/${teamId}/request-join`, {}, headers);
      toast.success("Join request sent");
      fetchTeams();
    } catch (err) {
      toast.error("Request failed");
    }
  };

  const leaveTeam = async (teamId) => {
    try {
      await axios.post(`${API}/teams/${teamId}/leave`, {}, headers);
      toast.success("Left team");
      fetchTeams();
    } catch (err) {
      toast.error("Leave failed");
    }
  };

  const approveUser = async (teamId, userId) => {
    try {
      await axios.post(`${API}/teams/${teamId}/approve/${userId}`, {}, headers);
      toast.success("User approved");
      fetchTeams();
    } catch (err) {
      toast.error("Approval failed");
    }
  };

  return (
    <div className="container">
      <h2>🏆 Teams</h2>

      {/* Admin Create Team */}
      {user.role === 'admin' && (
        <form onSubmit={createTeam} className="card">
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Team Name"
            required
          />
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Team Description"
          />
          <button type="submit">Create Team</button>
        </form>
      )}

      <ul className="space-y-4">
        {teams.map(team => {
          const isMember = team.members?.some(m => m._id === user.id || m === user.id);
          const hasRequested = team.joinRequests?.some(r => r._id === user.id || r === user.id);

          return (
            <li key={team._id} className="card">
              <h3><strong>{team.name}</strong></h3>
              <p><em>{team.description}</em></p>

              <div className="mt-2">
                <p className="font-semibold">👥 Members:</p>
                <ul style={{ paddingLeft: '1rem' }}>
                  {team.members?.length === 0 ? (
                    <li className="text-gray-500 italic">No members yet</li>
                  ) : (
                    team.members.map((member, idx) => (
                      <li key={idx}>
                        {typeof member === 'string' ? 'Unknown' : `${member.name} (${member.email})`}
                      </li>
                    ))
                  )}
                </ul>
              </div>

              {/* Member Actions */}
              {user.role === 'member' && (
                <div className="mt-2">
                  {!isMember && !hasRequested && (
                    <button onClick={() => requestJoin(team._id)}>Request to Join</button>
                  )}
                  {hasRequested && <p className="text-sm text-yellow-600">Pending approval...</p>}
                  {isMember && (
                    <button onClick={() => leaveTeam(team._id)}>Leave Team</button>
                  )}
                </div>
              )}

              {/* Admin sees join requests */}
              {user.role === 'admin' && team.joinRequests?.length > 0 && (
                <div className="mt-3">
                  <strong>🔒 Pending Join Requests:</strong>
                  <ul className="ml-4 mt-1">
                    {team.joinRequests.map((req, idx) => (
                      <li key={req._id || idx} className="flex justify-between items-center">
                        {typeof req === 'string' ? 'Unknown user' : `${req.name} (${req.email})`}
                        <button
                          onClick={() => approveUser(team._id, req._id)}
                          className="ml-2 px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Teams;
