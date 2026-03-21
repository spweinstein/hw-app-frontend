import api from "./apiConfig.js";

export const getTemplates = async (scope = "all") => {
  try {
    const resp = await api.get("api/workout-templates/", {
      params: { scope },
    });
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const getTemplate = async (templateId) => {
  try {
    const resp = await api.get(`api/workout-templates/${templateId}/`);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const createTemplate = async (templateData) => {
  try {
    const resp = await api.post("api/workout-templates/", templateData);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const updateTemplate = async (templateId, templateData) => {
  try {
    const resp = await api.put(
      `api/workout-templates/${templateId}/`,
      templateData,
    );
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTemplate = async (templateId) => {
  try {
    const resp = await api.delete(`api/workout-templates/${templateId}/`);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const scheduleWorkoutFromTemplate = async (templateId, body) => {
  try {
    const resp = await api.post(
      `/api/workout-templates/${templateId}/schedule/`,
      body,
    );
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const getTemplateItem = async (itemId) => {
  try {
    const resp = await api.get(`api/workout-template-items/${itemId}/`);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const addTemplateItem = async (itemData) => {
  try {
    const resp = await api.post("api/workout-template-items/", itemData);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const updateTemplateItem = async (itemId, itemData) => {
  try {
    const resp = await api.put(
      `api/workout-template-items/${itemId}/`,
      itemData,
    );
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTemplateItem = async (itemId) => {
  try {
    const resp = await api.delete(`api/workout-template-items/${itemId}/`);
    return resp.data;
  } catch (error) {
    throw error;
  }
};
