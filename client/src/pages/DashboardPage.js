import React, { useState, useEffect } from 'react';
import TaskManager from '../components/TaskManager';
import PomodoroTimer from '../components/PomodoroTimer';
import StatsCard from '../components/StatsCard';
import api from '../utils/api';

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({ today: { count: 0, totalMinutes: 0 }, week: { count: 0, totalMinutes: 0 } });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksRes, sessionsRes, statsRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/sessions'),
        api.get('/sessions/stats')
      ]);
      setTasks(tasksRes.data);
      setSessions(sessionsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = () => {
    loadData();
  };

  const handleSessionComplete = (sessionData) => {
    api.post('/sessions', sessionData)
      .then(() => loadData())
      .catch(error => console.error('Error saving session:', error));
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <div className="container py-4">
      <h2 className="dashboard-title subtle-heading">
        My Study Dashboard
      </h2>

      <div className="grid grid-3 mb-4">
        <StatsCard 
          title="Today's Sessions" 
          value={stats.today.count}
          subtitle={`${stats.today.totalMinutes} minutes`}
          color="var(--primary)"
        />
        <StatsCard 
          title="This Week" 
          value={stats.week.count}
          subtitle={`${stats.week.totalMinutes} minutes total`}
          color="var(--green)"
        />
        <StatsCard 
          title="Pending Tasks" 
          value={pendingTasks.length}
          subtitle={`${completedTasks.length} completed`}
          color="var(--warning)"
        />
      </div>

      <div className="grid grid-2">
        <div>
          <TaskManager 
            tasks={tasks}
            onTaskUpdate={handleTaskUpdate}
          />
        </div>

        <div>
          <PomodoroTimer 
            tasks={pendingTasks}
            onSessionComplete={handleSessionComplete}
          />
        </div>
      </div>

      {sessions.length > 0 && (
        <div className="card mt-4">
          <h3 className="text-primary mb-2" style={{ fontSize: '1.15rem', fontWeight: '500' }}>
            📈 Recent Study Sessions
          </h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {sessions.slice(0, 10).map(session => (
              <div
                key={session._id}
                style={{
                  padding: '0.75rem',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <strong>
                    {session.type === 'work' ? '🍅' : '☕'} {session.type.replace('_', ' ')}
                  </strong>
                  {session.task && (
                    <span style={{ color: 'var(--text-light)', marginLeft: '0.5rem' }}>
                      – {session.task.title}
                    </span>
                  )}
                </div>
                <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                  {session.duration} min • {new Date(session.startTime).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
