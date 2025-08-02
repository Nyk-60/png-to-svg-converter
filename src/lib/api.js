// src/lib/api.js
export const API_URL = "https://png-to-svg-backend.onrender.com";

// Örnek: Backend'e dosya gönderme fonksiyonu
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/api/convert`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Image conversion failed");
  }

  return await response.json();
}
