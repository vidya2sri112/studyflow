import React, { useState, useEffect, useRef } from 'react';

const PomodoroTimer = ({ tasks, onSessionComplete }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState('work'); // work, short_break, long_break
  const [selectedTask, setSelectedTask] = useState('');
  const [completedSessions, setCompletedSessions] = useState(0);
  const intervalRef = useRef(null);

  const sessionDurations = {
    work: 25 * 60,
    short_break: 5 * 60,
    long_break: 15 * 60
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft]);

  const handleSessionComplete = () => {
    setIsActive(false);
    
    // Save session data
    const sessionData = {
      type: sessionType,
      duration: sessionDurations[sessionType] / 60, // Convert to minutes
      startTime: new Date(Date.now() - sessionDurations[sessionType] * 1000),
      endTime: new Date(),
      task: selectedTask || null
    };

    onSessionComplete(sessionData);

    // Auto-switch session type
    if (sessionType === 'work') {
      setCompletedSessions(prev => prev + 1);
      const nextType = (completedSessions + 1) % 4 === 0 ? 'long_break' : 'short_break';
      setSessionType(nextType);
      setTimeLeft(sessionDurations[nextType]);
    } else {
      setSessionType('work');
      setTimeLeft(sessionDurations.work);
    }

    // Show completion notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`${sessionType.replace('_', ' ')} session completed!`);
    }
  };

  const startTimer = () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(sessionDurations[sessionType]);
  };

  const switchSession = (type) => {
    setIsActive(false);
    setSessionType(type);
    setTimeLeft(sessionDurations[type]);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getSessionEmoji = (type) => {
    switch (type) {
      case 'work': return '🍅';
      case 'short_break': return '☕';
      case 'long_break': return '🌟';
      default: return '🍅';
    }
  };

  const progress = ((sessionDurations[sessionType] - timeLeft) / sessionDurations[sessionType]) * 100;

  return (
    <div className="card">
      <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
        {getSessionEmoji(sessionType)} Pomodoro Timer
      </h3>

      {/* Session Type Selector */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
        {Object.keys(sessionDurations).map(type => (
          <button
            key={type}
            onClick={() => switchSession(type)}
            style={{
              padding: '0.5rem 1rem',
              border: sessionType === type ? '2px solid var(--primary)' : '1px solid var(--border)',
              borderRadius: '6px',
              background: sessionType === type ? 'var(--primary)' : 'white',
              color: sessionType === type ? 'white' : 'var(--text)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            {type.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Task Selector for Work Sessions */}
      {sessionType === 'work' && tasks.length > 0 && (
        <div className="form-group">
          <label className="form-label">Focus on task (optional):</label>
          <select
            className="form-input"
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
          >
            <option value="">Select a task...</option>
            {tasks.map(task => (
              <option key={task._id} value={task._id}>
                {task.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Timer Display */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          fontSize: '4rem',
          fontWeight: '700',
          color: isActive ? 'var(--primary)' : 'var(--text-light)',
          marginBottom: '1rem',
          fontFamily: 'monospace'
        }}>
          {formatTime(timeLeft)}
        </div>

        {/* Progress Bar */}
        <div style={{
          width: '100%',
          height: '8px',
          background: 'var(--border)',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '1rem'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'var(--primary)',
            transition: 'width 1s ease'
          }} />
        </div>

        <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>
          {sessionType.replace('_', ' ').toUpperCase()} SESSION
        </p>
      </div>

      {/* Timer Controls */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        {!isActive ? (
          <button onClick={startTimer} className="btn btn-primary">
            Start Session
          </button>
        ) : (
          <button onClick={pauseTimer} className="btn btn-outline">
            Pause
          </button>
        )}
        
        <button onClick={resetTimer} className="btn btn-secondary">
          Reset
        </button>
      </div>

      {/* Session Counter */}
      <div style={{ textAlign: 'center', marginTop: '1.5rem', padding: '1rem', background: 'var(--surface-hover)', borderRadius: '8px' }}>
        <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
          Completed Sessions Today: <strong>{completedSessions}</strong>
        </p>
        <p style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>
          Next long break after {4 - (completedSessions % 4)} work sessions
        </p>
      </div>
    </div>
  );
};

export default PomodoroTimer;