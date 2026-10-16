import api from './client';

export const getTodosAPI = async () => {
  const { data } = await api.get('/todos');
  return data;
};

export const createTodoAPI = async (todoData) => {
  const { data } = await api.post('/todos', todoData);
  return data;
};

export const updateTodoAPI = async (todoId, updateData) => {
  const { data } = await api.put(`/todos/${todoId}`, updateData);
  return data;
};

export const deleteTodoAPI = async (todoId) => {
  const { data } = await api.delete(`/todos/${todoId}`);
  return data;
};
