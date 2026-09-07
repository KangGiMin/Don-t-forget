/* [ 모든 컴포넌트가 공유할 공용 창고 ] */ 

// 데이터를 추가/수정/삭제 할 시, todoStore가 최신 리스트를 알아서 불러와 데이터 갱신해 줌

import { create } from 'zustand';
// 🌟 서버랑 통신할 API 함수들을 창고로 싹 다 불러오기!
import { getTodosAPI, createTodoAPI, updateTodoAPI, deleteTodoAPI } from '../api/todoApi';

const useTodoStore = create((set, get) => ({
  // 📦 1. 창고에 보관할 실제 데이터 (초기값은 빈 배열)
  todos: [],

  // 🛠️ 2. 할 일 불러오기 (Read)
  fetchTodos: async (userId, token) => {
    try {
      const result = await getTodosAPI(userId, token);
      if (result.success) {
        set({ todos: result.todos }); // 서버에서 받은 데이터로 창고 값 업데이트!
      }
    } catch (error) { 
      console.log("불러오기 에러:", error); 
    }
  },

  // 🛠️ 3. 할 일 추가하기 (Create)
  addTodo: async (todoData, token) => {
    try {
      const result = await createTodoAPI(todoData, token);
      if (result.success) {
        // 추가 성공하면? 창고에 있는 fetchTodos를 다시 실행해서 최신 목록으로 새로고침!
        get().fetchTodos(todoData.userId, token); 
      }
    } catch (error) { 
      console.log("추가 에러:", error); 
    }
  },

  // 🛠️ 4. 할 일 수정 & 완료 토글하기 (Update)
  updateTodo: async (id, updateData, userId, token) => {
    try {
      const result = await updateTodoAPI(id, updateData, token);
      if (result.success) {
        get().fetchTodos(userId, token); // 성공하면 역시나 새로고침!
      }
    } catch (error) { 
      console.log("수정 에러:", error); 
    }
  },

  // 🛠️ 5. 할 일 삭제하기 (Delete)
  deleteTodo: async (id, userId, token) => {
    try {
      const result = await deleteTodoAPI(id, token);
      if (result.success) {
        get().fetchTodos(userId, token); // 성공하면 새로고침!
      }
    } catch (error) { 
      console.log("삭제 에러:", error); 
    }
  }
}));

export default useTodoStore;