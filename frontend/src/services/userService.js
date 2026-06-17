import api from "./api";

export const getProfileGreeting = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};

export const updateSentimentAnalysis = async (enabled) => {
  await api.patch("/users/sentiment-analysis", { enabled });
};
