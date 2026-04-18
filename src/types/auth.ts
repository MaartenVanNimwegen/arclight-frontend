export interface AuthResponse {
  token: string;
  userName: string;
  role: "Admin" | "ContentCreator" | "User";
}

export interface User {
  email: string;
  name: string;
}
