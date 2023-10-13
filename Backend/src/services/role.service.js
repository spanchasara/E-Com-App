import Role from "../models/role.model.js";
import ApiError from "../utils/api-error.js";

const createRolePermissions = async (rolePermissionsBody) => {
  const roleObject = await Role.create(rolePermissionsBody);
  return roleObject;
};

const updateRolePermissions = async (role, permissions) => {
  const roleObject = await Role.findOne({ name: role });

  if (!roleObject) {
    throw new ApiError(httpStatus.NOT_FOUND, "Role not found");
  }

  roleObject.permissions = new Map([
    ...roleObject.permissions,
    ...Object.entries(permissions),
  ]);

  await roleObject.save();

  return roleObject;
};

export { createRolePermissions, updateRolePermissions };
