import { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pendiente');
  const [dueDate, setDueDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const { logout } = useAuth();
  const [alert, setAlert] = useState({ message: '', type: '' });

  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [createdFrom, setCreatedFrom] = useState('');
  const [createdTo, setCreatedTo] = useState('');

  const fetchTasks = async () => {
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (search) params.search = search;
      if (from) params.from = from;
      if (to) params.to = to;
      if (createdFrom) params.createdFrom = createdFrom;
      if (createdTo) params.createdTo = createdTo;

      const res = await API.get('/tasks', { params });
      setTasks(res.data);
    } catch (err) {
      setAlert({ message: 'Error al obtener tareas', type: 'error' });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tarea = { title, description, status, dueDate };

    if (!isEditing && status === 'completada') {
      setAlert({ message: 'No puedes crear una tarea como completada directamente desde pendiente.', type: 'error' });
      return;
    }

    if (isEditing) {
      const tareaAnterior = tasks.find(t => t.id === taskId);
      if (tareaAnterior.status === 'pendiente' && status === 'completada') {
        setAlert({ message: 'Primero debes pasar la tarea a "en progreso" antes de completarla.', type: 'error' });
        return;
      }
    }

    try {
      if (isEditing) {
        await API.put(`/tasks/${taskId}`, tarea);
        setAlert({ message: 'Tarea actualizada correctamente.', type: 'success' });
      } else {
        await API.post('/tasks', tarea);
        setAlert({ message: 'Tarea creada correctamente.', type: 'success' });
      }

      setIsEditing(false);
      setTaskId(null);
      setTitle('');
      setDescription('');
      setStatus('pendiente');
      setDueDate('');
      fetchTasks();
    } catch (err) {
      setAlert({ message: 'Error al guardar la tarea.', type: 'error' });
    }
  };

  const deleteTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (task?.status !== 'completada') {
      setAlert({ message: 'Solo puedes eliminar tareas completadas.', type: 'error' });
      return;
    }

    try {
      await API.delete(`/tasks/${id}`);
      setAlert({ message: 'Tarea eliminada correctamente.', type: 'success' });
      fetchTasks();
    } catch (err) {
      setAlert({ message: 'Error al eliminar la tarea.', type: 'error' });
    }
  };

  const startEdit = (task) => {
    setIsEditing(true);
    setTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setDueDate(task.dueDate?.slice(0, 10));
  };

  const clearFilters = () => {
    setFilterStatus('');
    setSearch('');
    setFrom('');
    setTo('');
    setCreatedFrom('');
    setCreatedTo('');
    fetchTasks();
  };

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ message: '', type: '' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (

  <div className="container">
        <div className="dashboard">
      <h2>Gestor de Tareas</h2>
      <button onClick={logout}>Cerrar sesión</button>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit}>
        <h3>{isEditing ? 'Editar Tarea' : 'Nueva Tarea'}</h3>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" required />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción" />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pendiente">Pendiente</option>
          <option value="en progreso">En Progreso</option>
          <option value="completada">Completada</option>
        </select>
        <label style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>Fecha de vencimiento:</label>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <button type="submit">{isEditing ? 'Actualizar' : 'Crear'}</button>
      </form>

      {alert.message && (
        <p className={`alert ${alert.type === 'error' ? 'error' : 'success'}`}>
          {alert.message}
        </p>
      )}

      {/* FILTROS */}
      <h3>Filtros</h3>
      <div className="filters" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="en progreso">En progreso</option>
          <option value="completada">Completada</option>
        </select>

        <input
          type="text"
          placeholder="Buscar por título o descripción"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label>Creado desde</label>
          <input
            type="date"
            value={createdFrom}
            onChange={(e) => setCreatedFrom(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label>Vence hasta</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        <button onClick={fetchTasks}>Aplicar filtros</button>
        <button onClick={clearFilters} type="button">Limpiar</button>
      </div>


      {/* LISTA DE TAREAS */}
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id}>
            <div>
              <strong>{task.title}</strong> - {task.status}
              <div className="task-dates">
                <p style={{ margin: '0.2rem 0', fontSize: '0.85rem', color: '#444' }}>
                  📌 Creado el: {new Date(task.createdAt).toLocaleDateString('es-BO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                {task.dueDate && (
                  <p style={{ margin: '0.2rem 0', fontSize: '0.85rem', color: '#555' }}>
                    ⏳ Vence: {new Intl.DateTimeFormat('es-BO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      timeZone: 'UTC' // 🔑 clave para evitar desfase
                    }).format(new Date(task.dueDate))}
                  </p>
                )}
              </div>
              {task.description && (
                <p style={{ margin: '0.3rem 0 0', color: '#333' }}>
                  {task.description}
                </p>
              )}
            </div>
            <div className="task-actions">
              <button onClick={() => startEdit(task)}>Editar</button>
              <button onClick={() => deleteTask(task.id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
  
  );
}