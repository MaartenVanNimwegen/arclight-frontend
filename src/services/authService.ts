import client from "../api/client";
import type { AuthResponse } from "../types/auth";

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await client.post<AuthResponse>("/user/login", {
      email,
      password,
    });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  register: async (data: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) => {
    const response = await client.post("/user/register", data);
    return response.data;
  },
};
