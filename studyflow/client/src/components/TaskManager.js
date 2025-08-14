import React, { useState } from 'react';
import api from '../utils/api';

const TaskManager = ({ tasks, onTaskUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', formData);
      setFormData({ title: '', description: '', priority: 'medium', dueDate: '' });
      setShowForm(false);
      onTaskUpdate();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const toggleTaskStatus = async (taskId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      onTaskUpdate();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        onTaskUpdate();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const priorityColors = {
    low: '#10b981',
    medium: '#f59e0b', 
    high: '#ef4444'
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ color: 'var(--primary)' }}>📝 My Tasks</h3>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
          style={{ padding: '0.5rem 1rem' }}
        >
          {showForm ? 'Cancel' : '+ Add Task'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--surface-hover)', borderRadius: '8px' }}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Task title..."
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <textarea
              placeholder="Description (optional)..."
              className="form-input"
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <select
              className="form-input"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <input
              type="date"
              className="form-input"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-secondary mt-2">
            Create Task
          </button>
        </form>
      )}

      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {tasks.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>
            No tasks yet. Create your first task to get started! 🚀
          </p>
        ) : (
          tasks.map(task => (
            <div key={task._id} style={{
              padding: '1rem',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              marginBottom: '0.75rem',
              background: task.status === 'completed' ? '#f0f9ff' : 'white'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ 
                    marginBottom: '0.25rem',
                    textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                    color: task.status === 'completed' ? 'var(--text-light)' : 'var(--text)'
                  }}>
                    {task.title}
                  </h4>
                  
                  {task.description && (
                    <p style={{ 
                      color: 'var(--text-light)', 
                      fontSize: '0.9rem',
                      marginBottom: '0.5rem'
                    }}>
                      {task.description}
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      background: priorityColors[task.priority],
                      color: 'white'
                    }}>
                      {task.priority}
                    </span>
                    
                    {task.dueDate && (
                      <span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>
                        📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                  <button
                    onClick={() => toggleTaskStatus(task._id, task.status)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      border: 'none',
                      borderRadius: '4px',
                      background: task.status === 'completed' ? 'var(--warning)' : 'var(--secondary)',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    {task.status === 'completed' ? 'Undo' : 'Complete'}
                  </button>
                  
                  <button
                    onClick={() => deleteTask(task._id)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      border: 'none',
                      borderRadius: '4px',
                      background: 'var(--error)',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskManager;