import { apiGet, apiPost, apiPut, apiDelete } from "../../../services/api/client";

export function getTodosAPI() { return apiGet("/todos"); }
export function createTodoAPI(todo) { return apiPost("/todos", todo); }
export function updateTodoAPI(todoId, updates) { return apiPut("/todos/" + encodeURIComponent(todoId), updates); }
export async function deleteTodoAPI(todoId) {
  return apiDelete("/todos/" + encodeURIComponent(todoId));
}
