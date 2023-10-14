export type Signup = {
    firstName: string,
    lastName?: string,
    username: string,
    email: string,
    password: string,
  };

export type SignIn = {
  email: string,
  password: string,
};