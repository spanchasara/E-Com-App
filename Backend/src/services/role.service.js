import Role from "../models/role.model.js";
import ApiError from "../utils/api-error.js";

const createRolePermissions = async (rolePermissionsBody) => {
  const roleObject = await Role.create(rolePermissionsBody);
  return roleObject;
};

const updateRolePermissions = async (role, permissions) => {
  const roleObject = await Role.findOneAndUpdate(
    { role },
    { permissions },
    {
      new: true,
    }
  );

  if (!roleObject) {
    throw new ApiError(httpStatus.NOT_FOUND, "Role not found");
  }

  return roleObject;
};

export { createRolePermissions, updateRolePermissions };
