import * as roleService from "../services/role.service.js";
import catchAsync from "../utils/catch-async.js";

/* Register - controller */
const createRolePermissions = catchAsync(async (req, res) => {
  const rolePermissionsBody = req.body;
  const response = await roleService.createRolePermissions(rolePermissionsBody);
  res.send(response);
});

/* Login - controller */
const updateRolePermissions = catchAsync(async (req, res) => {
  const { role } = req.params;
  const { permissions } = req.body;

  const response = await roleService.updateRolePermissions(role, permissions);
  res.send(response);
});

export { createRolePermissions, updateRolePermissions };
