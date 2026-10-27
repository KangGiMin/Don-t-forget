import { apiUrl } from "@/shared/config/api";
import { getFirebaseAuthHeaders } from "@/shared/services/firebase/idToken";

async function request(path, options = {}) {
  const response = await fetch(apiUrl(path), { ...options, headers: await getFirebaseAuthHeaders(options.body ? { "Content-Type": "application/json" } : {}) });
  return response.json();
}
export const getRoutines = () => request("/routines");
export const createRoutine = (data) => request("/routines", { method: "POST", body: JSON.stringify(data) });
export const updateRoutine = (id, data) => request(`/routines/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteRoutine = (id) => request(`/routines/${encodeURIComponent(id)}`, { method: "DELETE" });
export const getJournals = (date) => request(`/journals?from=${encodeURIComponent(date)}&to=${encodeURIComponent(date)}`);
export const saveJournal = (data) => request("/journals", { method: "PUT", body: JSON.stringify(data) });
export const deleteJournal = (date) => request(`/journals/${encodeURIComponent(date)}`, { method: "DELETE" });
export const getLeaderboard = () => request("/leaderboard");
export const getMyStats = () => request("/leaderboard/me");
