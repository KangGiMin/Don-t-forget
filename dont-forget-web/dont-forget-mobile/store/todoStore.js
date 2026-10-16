import { create } from "zustand";
import api from "../api/client";
import { auth } from "../firebase/firebase";

const getLocalDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const assertSuccess = (data, fallbackMessage) => {
  if (!data?.success) {
    throw new Error(data?.message || fallbackMessage);
  }
};

const useTodoStore = create((set, get) => ({
  todos: [],
  clearTodos: () => set({ todos: [] }),

  fetchTodos: async () => {
    const uid = auth.currentUser?.uid;
    const { data } = await api.get("/todos");
    assertSuccess(data, "할 일 목록을 불러오지 못했습니다.");
    if (auth.currentUser?.uid === uid) set({ todos: data.todos });
  },

  addTodo: async (text) => {
    const uid = auth.currentUser?.uid;
    if (typeof text !== "string" || !text.trim()) {
      throw new Error("할 일 내용을 입력해 주세요.");
    }

    const { data } = await api.post("/todos", {
      text: text.trim(),
      category: "개인",
      dueDate: getLocalDate(),
      priority: "보통",
    });
    assertSuccess(data, "할 일을 추가하지 못했습니다.");

    if (auth.currentUser?.uid === uid) {
      set((state) => ({ todos: [...state.todos, data.todo] }));
    }
    return data.todo;
  },

  updateTodo: async (id, updateData) => {
    const uid = auth.currentUser?.uid;
    const { data } = await api.put(`/todos/${id}`, updateData);
    assertSuccess(data, "할 일을 수정하지 못했습니다.");

    if (auth.currentUser?.uid === uid) {
      set((state) => ({
        todos: state.todos.map((todo) => (todo._id === id ? data.todo : todo)),
      }));
    }
    return data.todo;
  },

  toggleTodo: async (id, currentCompleted) =>
    get().updateTodo(id, { completed: !currentCompleted }),

  deleteTodo: async (id) => {
    const uid = auth.currentUser?.uid;
    const { data } = await api.delete(`/todos/${id}`);
    assertSuccess(data, "할 일을 삭제하지 못했습니다.");

    if (auth.currentUser?.uid === uid) {
      set((state) => ({
        todos: state.todos.filter((todo) => todo._id !== id),
      }));
    }
  },
}));

export default useTodoStore;
