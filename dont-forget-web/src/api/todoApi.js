// 🌟 서버 주소가 바뀌면 여기 딱 한 군데만 수정하면 됨.
const BASE_URL = 'http://localhost:3000/api';

// 1. 할 일 불러오기 (Read)
export const getTodosAPI = async (userId, token) => {
  const response = await fetch(`${BASE_URL}/todos/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

// 2. 할 일 추가하기 (Create)
export const createTodoAPI = async (todoData, token) => {
  const response = await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(todoData),
  });
  return response.json();
};

// 3. 할 일 수정 및 완료 토글 (Update)
export const updateTodoAPI = async (todoId, updateData, token) => {
  const response = await fetch(`${BASE_URL}/todos/${todoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(updateData),
  });
  return response.json();
};

// 4. 할 일 삭제하기 (Delete)
export const deleteTodoAPI = async (todoId, token) => {
  const response = await fetch(`${BASE_URL}/todos/${todoId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

// 5. 해시태그 검색하기 (Search)
export const searchTodosAPI = async (userId, searchTags, token) => {
  const response = await fetch(`${BASE_URL}/todos/${userId}?tags=${searchTags}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};