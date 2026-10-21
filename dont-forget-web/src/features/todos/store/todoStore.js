import { create } from 'zustand';
import {
  getTodosAPI,
  createTodoAPI,
  updateTodoAPI,
  deleteTodoAPI,
} from '../api/todoApi';

const getErrorMessage = (error, fallback) =>
  error?.message || fallback;

const useTodoStore = create((set, get) => ({
  todos: [],
  error: '',

  fetchTodos: async (userId) => {
    try {
      const result = await getTodosAPI(userId);
      if (!result.success || !Array.isArray(result.todos)) {
        throw new Error(result.message || '할 일을 불러오지 못했습니다.');
      }

      set({ todos: result.todos, error: '' });
      return result.todos;
    } catch (error) {
      set({ error: getErrorMessage(error, '서버에서 할 일을 불러오지 못했습니다.') });
      return null;
    }
  },

  addTodo: async (todoData) => {
    try {
      const result = await createTodoAPI(todoData);
      if (!result.success || !result.todo) {
        throw new Error(result.message || '할 일을 저장하지 못했습니다.');
      }

      // 서버가 반환한 할 일을 즉시 화면에 반영해 새로고침 응답을 기다리는 동안에도 보이게 한다.
      set((state) => ({
        todos: [result.todo, ...state.todos.filter((todo) => todo._id !== result.todo._id)],
        error: '',
      }));

      // 정렬과 서버 상태를 동기화한다. 실패해도 위에서 추가한 할 일은 화면에 유지된다.
      await get().fetchTodos(todoData.userId);
      return { success: true, todo: result.todo };
    } catch (error) {
      const message = getErrorMessage(error, '할 일을 추가하지 못했습니다.');
      set({ error: message });
      return { success: false, error: message };
    }
  },

  updateTodo: async (id, updateData, userId) => {
    try {
      const result = await updateTodoAPI(id, updateData);
      if (!result.success) throw new Error(result.message || '할 일을 수정하지 못했습니다.');
      await get().fetchTodos(userId);
      return { success: true };
    } catch (error) {
      const message = getErrorMessage(error, '할 일을 수정하지 못했습니다.');
      set({ error: message });
      return { success: false, error: message };
    }
  },

  deleteTodo: async (id, userId) => {
    try {
      const result = await deleteTodoAPI(id);
      if (!result.success) throw new Error(result.message || '할 일을 삭제하지 못했습니다.');
      await get().fetchTodos(userId);
      return { success: true };
    } catch (error) {
      const message = getErrorMessage(error, '할 일을 삭제하지 못했습니다.');
      set({ error: message });
      return { success: false, error: message };
    }
  },
}));

export default useTodoStore;



