import api from "./apiConfig.js";

export const getWorkouts = async (start, end) => {
  try {
    const resp = await api.get("/api/workouts/", {
      params: {
        start,
        end,
      },
    });
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const getWorkout = async (workoutId) => {
  try {
    const resp = await api.get(`/api/workouts/${workoutId}/`);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const createWorkout = async (workoutData) => {
  try {
    const resp = await api.post("/api/workouts/", workoutData);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const updateWorkout = async (workoutId, workoutData) => {
  try {
    const resp = await api.patch(`/api/workouts/${workoutId}/`, workoutData);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const deleteWorkout = async (workoutId) => {
  try {
    const resp = await api.delete(`/api/workouts/${workoutId}/`);
    return resp.data;
  } catch (error) {
    throw error;
  }
};
