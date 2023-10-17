export type User = {
  _id?: string,
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  role: string,
  isActive: boolean,
};
export type UpdateUser = {
  firstName?: string,
  lastName?: string,
  username?: string,
  email?: string,
}