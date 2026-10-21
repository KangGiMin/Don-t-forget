import { apiPost } from "../../../services/api/client";
export function sendAdminMessage(payload) { return apiPost("/contact", payload); }
