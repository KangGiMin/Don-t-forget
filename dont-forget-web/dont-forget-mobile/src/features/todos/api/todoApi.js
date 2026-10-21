import axios from "axios";
import { apiGet, apiPost, apiPut, authenticatedConfig } from "../../../services/api/client";
import { API_URL } from "../../../services/api/config";

export function getTodosAPI() { return apiGet("/todos"); }
export function createTodoAPI(todo) { return apiPost("/todos", todo); }
export function updateTodoAPI(todoId, updates) { return apiPut("/todos/" + encodeURIComponent(todoId), updates); }
export async function deleteTodoAPI(todoId) {
  return axios.delete(API_URL + "/todos/" + encodeURIComponent(todoId), await authenticatedConfig());
}
