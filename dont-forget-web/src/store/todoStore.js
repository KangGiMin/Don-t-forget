import { create } from 'zustand';
import api from '../api/client';
import { auth } from '../firebase/firebase';

const useTodoStore = create((set) => ({
  todos: [],
  clearTodos: () => set({ todos: [] }),

  fetchTodos: async () => {
    const uid = auth.currentUser?.uid;
    const { data } = await api.get('/todos');
    if (!data.success) {
      throw new Error(data.message || '할 일 목록을 불러오지 못했습니다.');
    }
    if (auth.currentUser?.uid === uid) set({ todos: data.todos });
  },

  addTodo: async ({ text, dueDate, category }) => {
    const uid = auth.currentUser?.uid;
    const { data } = await api.post('/todos', {
      text,
      dueDate,
      category,
    });
    if (!data.success) {
      throw new Error(data.message || '할 일을 추가하지 못했습니다.');
    }
    if (auth.currentUser?.uid === uid) {
      set((state) => ({ todos: [...state.todos, data.todo] }));
    }
    return data.todo;
  },

  updateTodo: async (id, updateData) => {
    const uid = auth.currentUser?.uid;
    const { data } = await api.put(`/todos/${id}`, updateData);
    if (!data.success) {
      throw new Error(data.message || '할 일을 수정하지 못했습니다.');
    }
    if (auth.currentUser?.uid === uid) {
      set((state) => ({
        todos: state.todos.map((todo) => (todo._id === id ? data.todo : todo)),
      }));
    }
    return data.todo;
  },

  deleteTodo: async (id) => {
    const uid = auth.currentUser?.uid;
    const { data } = await api.delete(`/todos/${id}`);
    if (!data.success) {
      throw new Error(data.message || '할 일을 삭제하지 못했습니다.');
    }
    if (auth.currentUser?.uid === uid) {
      set((state) => ({
        todos: state.todos.filter((todo) => todo._id !== id),
      }));
    }
  },
}));

export default useTodoStore;
