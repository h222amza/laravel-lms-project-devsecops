// src/services/api.js
import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";
export const getSettings = async () => {
  try {
    const response = await axios.get(`${API_URL}/settings`);
    return response.data;
  } catch (error) {
    console.error("Ayarlar yüklenirken hata:", error);
    throw error;
  }
};
