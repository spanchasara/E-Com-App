export type User = {
  _id?: string,
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  role: string,
  isActive: boolean,
  passwordChangedAt: Date,
  token: string,
};
