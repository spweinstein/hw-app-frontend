import api from "./apiConfig.js";

export const getPlans = async (scope = "all") => {
  const resp = await api.get("api/workout-plans/", {
    params: { scope },
  });
  return resp.data;
};

export const getPlan = async (planId) => {
  const resp = await api.get(`api/workout-plans/${planId}/`);
  return resp.data;
};

export const createPlan = async (planData) => {
  const resp = await api.post("api/workout-plans/", planData);
  return resp.data;
};

export const updatePlan = async (planId, planData) => {
  const resp = await api.put(`api/workout-plans/${planId}/`, planData);
  return resp.data;
};

export const deletePlan = async (planId) => {
  const resp = await api.delete(`api/workout-plans/${planId}/`);
  return resp.data;
};

/**
 * POST /api/workout-plans/:id/generate/ — materializes plan onto calendar.
 * @param {string|number} planId
 * @param {{ start_dt: string, end_dt: string }} body — ISO start_dt, end_dt inclusive date (YYYY-MM-DD or ISO)
 */
export const generateWorkoutsFromPlan = async (planId, body) => {
  const resp = await api.post(`api/workout-plans/${planId}/generate/`, body);
  return resp.data;
};
