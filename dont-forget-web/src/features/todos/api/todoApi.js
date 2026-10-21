import { apiUrl } from "@/shared/config/api";
import { getFirebaseAuthHeaders } from "@/shared/services/firebase/idToken";

export const getTodosAPI = async (userId) => {
  const response = await fetch(apiUrl(`/todos/${encodeURIComponent(userId)}`), {
    headers: await getFirebaseAuthHeaders(),
  });
  return response.json();
};

export const createTodoAPI = async (todoData) => {
  const response = await fetch(apiUrl("/todos"), {
    method: "POST",
    headers: await getFirebaseAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(todoData),
  });
  return response.json();
};

export const updateTodoAPI = async (todoId, updateData) => {
  const response = await fetch(apiUrl(`/todos/${encodeURIComponent(todoId)}`), {
    method: "PUT",
    headers: await getFirebaseAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(updateData),
  });
  return response.json();
};

export const deleteTodoAPI = async (todoId) => {
  const response = await fetch(apiUrl(`/todos/${encodeURIComponent(todoId)}`), {
    method: "DELETE",
    headers: await getFirebaseAuthHeaders(),
  });
  return response.json();
};

