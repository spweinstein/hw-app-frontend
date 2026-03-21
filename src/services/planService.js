import api from "./apiConfig.js";

export const getPlans = async (scope = "all") => {
  try {
    const resp = await api.get("/api/workout-plans/", {
      params: { scope }
    });
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const getPlan = async (planId) => {
  try {
    const resp = await api.get(`/api/workout-plans/${planId}/`);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const createPlan = async (planData) => {
  try {
    const resp = await api.post("/api/workout-plans/", planData);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const updatePlan = async (planId, planData) => {
  try {
    const resp = await api.patch(`/api/workout-plans/${planId}/`, planData);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const deletePlan = async (planId) => {
  try {
    const resp = await api.delete(`/api/workout-plans/${planId}/`);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const addTemplateToPlan = async (linkData) => {
  try {
    const resp = await api.post("/api/workout-template-plans/", linkData);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const updatePlanTemplateLink = async (linkId, linkData) => {
  try {
    const resp = await api.patch(
      `/api/workout-template-plans/${linkId}/`,
      linkData,
    );
    return resp.date;
  } catch (error) {
    throw error;
  }
};

export const removeTemplateFromPlan = async (linkId) => {
  try {
    const resp = await api.delete(`/api/workout-template-plans/${linkId}/`);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const generateWorkoutsFromPlan = async (planId) => {
  try {
    const resp = await api.post(`/api/workout-plans/${planId}/generate/`);
    return resp.data;
  } catch (error) {
    throw error;
  }
};