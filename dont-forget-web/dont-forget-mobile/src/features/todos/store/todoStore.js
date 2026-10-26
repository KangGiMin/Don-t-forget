import { create } from "zustand";
import { createTodoAPI, deleteTodoAPI, getTodosAPI, updateTodoAPI } from "../api/todoApi";
import { formatLocalDate } from "../../../shared/utils/date";
import { getApiErrorMessage } from "../../../services/api/client";

export const TODO_CATEGORIES = ["근무", "운동", "예약", "공부", "약속", "기타"];
export const TODO_CATEGORY_EMOJIS = { 근무: "💼", 운동: "🏃", 예약: "📅", 공부: "📚", 약속: "🤝", 기타: "✨" };

const useTodoStore = create((set, get) => ({
  todos: [],
  error: "",
  loading: false,

  fetchTodos: async () => {
    set({ loading: true, error: "" });
    try {
      const response = await getTodosAPI();
      if (!response.data.success || !Array.isArray(response.data.todos)) {
        throw new Error(response.data.message || "할 일을 불러오지 못했습니다.");
      }
      set({ todos: response.data.todos, error: "" });
      return true;
    } catch (error) {
      set({ error: getApiErrorMessage(error, "서버에서 할 일을 불러오지 못했습니다.") });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  addTodo: async ({ text, category, dueDate }) => {
    try {
      const response = await createTodoAPI({
        text: text.trim(),
        dueDate: dueDate || formatLocalDate(new Date()),
        category: category || "근무",
      });
      if (response.data.success && response.data.todo) {
        set((state) => ({ todos: [response.data.todo, ...state.todos], error: "" }));
        return true;
      }
      set({ error: response.data.message || "할 일을 추가하지 못했습니다." });
      return false;
    } catch (error) {
      set({ error: getApiErrorMessage(error, "할 일을 추가하지 못했습니다.") });
      return false;
    }
  },

  updateTodo: async (todoId, updates) => {
    try {
      const response = await updateTodoAPI(todoId, updates);
      if (response.data.success && response.data.todo) {
        set((state) => ({
          todos: state.todos.map((todo) => todo._id === todoId ? response.data.todo : todo),
          error: "",
        }));
        return true;
      }
      set({ error: response.data.message || "할 일을 수정하지 못했습니다." });
      return false;
    } catch (error) {
      set({ error: getApiErrorMessage(error, "할 일을 수정하지 못했습니다.") });
      return false;
    }
  },

  toggleTodo: async (todo) => get().updateTodo(todo._id, { completed: !todo.completed }),

  deleteTodo: async (todoId) => {
    try {
      const response = await deleteTodoAPI(todoId);
      if (response.data.success) {
        set((state) => ({ todos: state.todos.filter((todo) => todo._id !== todoId), error: "" }));
        return true;
      }
      set({ error: response.data.message || "할 일을 삭제하지 못했습니다." });
      return false;
    } catch (error) {
      set({ error: getApiErrorMessage(error, "할 일을 삭제하지 못했습니다.") });
      return false;
    }
  },
}));

export default useTodoStore;
