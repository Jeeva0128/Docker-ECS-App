import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
    page: 1,
    limit: 10
  });

  const fetchStats = async () => {
    try {
      const res = await api.get('/api/tasks/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.priority) queryParams.append('priority', filters.priority);
      if (filters.search) queryParams.append('search', filters.search);
      queryParams.append('page', filters.page);
      queryParams.append('limit', filters.limit);
      
      const res = await api.get(`/api/tasks?${queryParams.toString()}`);
      setTasks(res.data.tasks);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchTasks();
  }, [filters]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.del(`/api/tasks/${id}`);
      fetchTasks();
      fetchStats();
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const toggleComplete = async (task) => {
    try {
      await api.put(`/api/tasks/${task._id}`, {
        status: task.status === 'completed' ? 'pending' : 'completed'
      });
      fetchTasks();
      fetchStats();
    } catch (err) {
      alert('Failed to update task');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  const renderPagination = () => {
    if (!pagination.pages || pagination.pages <= 1) return null;
    return (
      <div className="pagination">
        <button 
          disabled={pagination.current <= 1} 
          onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
          className="btn btn-secondary btn-sm"
        >
          Previous
        </button>
        <span className="page-info">Page {pagination.current} of {pagination.pages}</span>
        <button 
          disabled={pagination.current >= pagination.pages} 
          onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
          className="btn btn-secondary btn-sm"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <Link to="/tasks/new" className="btn btn-primary">New Task</Link>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card border-top-blue">
            <h3>Total Tasks</h3>
            <p className="stat-value">{stats.total}</p>
          </div>
          <div className="stat-card border-top-yellow">
            <h3>Pending</h3>
            <p className="stat-value">{stats.pending}</p>
          </div>
          <div className="stat-card border-top-blue-light">
            <h3>In Progress</h3>
            <p className="stat-value">{stats.inProgress}</p>
          </div>
          <div className="stat-card border-top-green">
            <h3>Completed</h3>
            <p className="stat-value">{stats.completed}</p>
          </div>
          <div className="stat-card border-top-red">
            <h3>High Priority</h3>
            <p className="stat-value">{stats.highPriority}</p>
          </div>
          <div className="stat-card border-top-orange">
            <h3>Overdue</h3>
            <p className="stat-value">{stats.overdue}</p>
          </div>
        </div>
      )}

      <div className="filters-bar">
        <input
          type="text"
          name="search"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={handleFilterChange}
          className="form-control"
        />
        <select name="status" value={filters.status} onChange={handleFilterChange} className="form-control">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select name="priority" value={filters.priority} onChange={handleFilterChange} className="form-control">
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-spinner layout-center"></div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks found.</p>
          <Link to="/tasks/new" className="btn btn-primary">Create one</Link>
        </div>
      ) : (
        <div className="tasks-list">
          {tasks.map(task => (
            <div key={task._id} className="task-card">
              <div className="task-card-content">
                <h3 className={`task-title ${task.status === 'completed' ? 'strike' : ''}`}>
                  {task.title}
                </h3>
                {task.description && <p className="task-desc">{task.description}</p>}
                <div className="task-meta">
                  <span className={`badge badge-status-${task.status}`}>{task.status.replace('-', ' ')}</span>
                  <span className={`badge badge-priority-${task.priority}`}>{task.priority}</span>
                  {task.dueDate && <span className="task-date">Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                </div>
              </div>
              <div className="task-actions">
                <button onClick={() => toggleComplete(task)} className="btn btn-sm btn-success">
                  {task.status === 'completed' ? 'Reopen' : 'Done'}
                </button>
                <Link to={`/tasks/${task._id}/edit`} className="btn btn-sm btn-secondary">Edit</Link>
                <button onClick={() => handleDelete(task._id)} className="btn btn-sm btn-danger">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {renderPagination()}
    </div>
  );
};

export default DashboardPage;
