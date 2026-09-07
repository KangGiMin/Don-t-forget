import { create } from 'zustand';
import axios from 'axios';

// 네 컴퓨터의 로컬 IP 주소와 서버 포트
const API_URL = 'http://192.168.0.10:3000/api/todos'; 

const useTodoStore = create((set, get) => ({
  todos: [],

  // 1. 서버에서 데이터 불러오기 (Read)
  fetchTodos: async () => {
    try {
      const response = await axios.get(API_URL);
      set({ todos: response.data });
    } catch (error) {
      console.error('불러오기 에러:', error);
    }
  },

  // 2. 서버에 할 일 추가 (Create)
  addTodo: async (text) => {
    try {
      const response = await axios.post(API_URL, { text, done: false,
        userId: 'testUser',
        dueDate: '2026-12-31'
       });
      set((state) => ({ todos: [...state.todos, response.data] }));
    } catch (error) {
      console.error('추가 에러:', error);
    }
  },

  // 3. 서버에 완료 상태 수정 (Update)
  toggleTodo: async (id, currentDone) => {
    try {
      await axios.put(`${API_URL}/${id}`, { done: !currentDone });
      set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === id ? { ...todo, done: !todo.done } : todo
        )
      }));
    } catch (error) {
      console.error('수정 에러:', error);
    }
  },

  // 4. 서버에서 삭제 (Delete)
  deleteTodo: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id)
      }));
    } catch (error) {
      console.error('삭제 에러:', error);
    }
  }
}));

export default useTodoStore;