import api from "./api";

const normalizeToken = (data) => {
  if (typeof data === "string") {
    return data;
  }

  return data?.token || data?.jwt || data?.accessToken;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/public/login", credentials);
  const token = normalizeToken(response.data);

  if (!token) {
    throw new Error("Login succeeded but no JWT token was returned.");
  }

  return token;
};

export const registerUser = async (payload) => {
  await api.post("/public/create-user", payload);
};

export const loginWithGoogleCode = async (code) => {
  const response = await api.get("/auth/google/callback", { params: { code } });
  const token = normalizeToken(response.data);

  if (!token) {
    throw new Error("Google login succeeded but no JWT token was returned.");
  }

  return token;
};

export const getGoogleLoginUrl = () => `${api.defaults.baseURL}/auth/google/authorize`;
