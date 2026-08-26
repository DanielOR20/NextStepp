/**
 * Servicio de Postulaciones (JobConnect / NextStepp)
 * Interactúa con la API de DummyJSON mapeando la entidad /posts
 */

const BASE_URL = 'https://dummyjson.com/posts';

/**
 * Obtiene los headers requeridos, incluyendo JWT de localStorage si existe
 * @returns {HeadersInit}
 */
function getHeaders() {
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * 1. GET /posts
 * Obtiene el listado completo de postulaciones
 * @param {number} limit
 * @param {number} skip
 * @returns {Promise<{posts: Array, total: number, skip: number, limit: number}>}
 */
export async function getPostulaciones(limit = 30, skip = 0) {
  const response = await fetch(`${BASE_URL}?limit=${limit}&skip=${skip}`, {
    method: 'GET',
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudieron obtener las postulaciones.`);
  }

  return await response.json();
}

/**
 * 2. POST /posts/add
 * Crea una nueva postulación (Easy Apply)
 * @param {{title: string, body: string, userId: number, tags?: string[]}} data
 * @returns {Promise<Object>}
 */
export async function createPostulacion(data) {
  const payload = {
    title: data.title,
    body: data.body,
    userId: Number(data.userId),
    tags: data.tags || ['General', 'Empleo']
  };

  const response = await fetch(`${BASE_URL}/add`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudo registrar la postulación.`);
  }

  return await response.json();
}

/**
 * 3. PATCH /posts/{id}
 * Edita parcialmente una postulación existente
 * @param {number|string} id
 * @param {Object} partialData
 * @returns {Promise<Object>}
 */
export async function updatePostulacion(id, partialData) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(partialData)
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudo actualizar la postulación #${id}.`);
  }

  return await response.json();
}

/**
 * 4. DELETE /posts/{id}
 * Cancela/elimina una postulación existente
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export async function deletePostulacion(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudo retirar la postulación #${id}.`);
  }

  return await response.json();
}
