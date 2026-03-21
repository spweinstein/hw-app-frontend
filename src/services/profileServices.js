import api from "./apiConfig";

export const getProfile = async (userId) => {
  try {
    const resp = await api.get(`/api/profiles/${userId}/`);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const updateHeight = async (userId, height, avatarFile = null) => {
  try {
    const formData = new FormData();
    if (height !== undefined && height !== null) {
      formData.append("height", height);
    }
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    const resp = await api.put(`/api/profiles/${userId}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const getWeightLogs = async (userId) => {
  try {
    const resp = await api.get(`/api/weight-logs/?user=${userId}`);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const createWeightLog = async (weightData) => {
  try {
    const resp = await api.post(`/api/weight-logs/`, weightData);
    return resp.data;
  } catch (error) {
    throw error;
  }
};