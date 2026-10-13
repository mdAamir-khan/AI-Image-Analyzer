const API_BASE = '/api';

/**
 * Retrieves the locally stored custom OpenRouter key (if any).
 */
export function getLocalApiKey() {
  return localStorage.getItem('imagereco_openrouter_key') || '';
}

/**
 * Stores or clears custom OpenRouter key in localStorage.
 */
export function setLocalApiKey(key) {
  if (key && key.trim()) {
    localStorage.setItem('imagereco_openrouter_key', key.trim());
  } else {
    localStorage.removeItem('imagereco_openrouter_key');
  }
}

/**
 * Returns common headers, appending custom OpenRouter key if present.
 */
function getHeaders(customHeaders = {}) {
  const headers = { ...customHeaders };
  const customKey = getLocalApiKey();
  if (customKey) {
    headers['X-OpenRouter-Key'] = customKey;
  }
  return headers;
}

/**
 * Fetch server configuration and API status.
 */
export async function getSystemStatus() {
  const res = await fetch(`${API_BASE}/config/status`);
  if (!res.ok) {
    throw new Error(`Failed to fetch status: ${res.statusText}`);
  }
  return res.json();
}

/**
 * Upload an image file for AI object analysis.
 */
export async function uploadAndAnalyze(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/analysis/upload`, {
    method: 'POST',
    headers: getHeaders(),
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Upload failed with status ${res.status}`);
  }
  return data;
}

/**
 * Send camera-captured base64 image for AI object analysis.
 */
export async function captureAndAnalyze(imageBase64, fileName = 'webcam_capture.jpg') {
  const res = await fetch(`${API_BASE}/analysis/capture`, {
    method: 'POST',
    headers: getHeaders({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      imageBase64,
      fileName,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Analysis failed with status ${res.status}`);
  }
  return data;
}

/**
 * Retrieve analysis history list.
 */
export async function getHistory() {
  const res = await fetch(`${API_BASE}/analysis/history`);
  if (!res.ok) {
    throw new Error('Failed to retrieve history');
  }
  return res.json();
}

/**
 * Retrieve specific analysis by ID.
 */
export async function getAnalysisById(id) {
  const res = await fetch(`${API_BASE}/analysis/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch analysis record #${id}`);
  }
  return res.json();
}

/**
 * Delete analysis record.
 */
export async function deleteAnalysis(id) {
  const res = await fetch(`${API_BASE}/analysis/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(`Failed to delete record #${id}`);
  }
  return res.json();
}
