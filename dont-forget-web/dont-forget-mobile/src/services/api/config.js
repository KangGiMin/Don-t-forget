import { Platform } from "react-native";

const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
const emulatorDefault = Platform.OS === "android" ? "http://10.0.2.2:3000/api" : "http://localhost:3000/api";

export const API_URL = (configuredUrl || emulatorDefault).replace(/\/+$/, "");
