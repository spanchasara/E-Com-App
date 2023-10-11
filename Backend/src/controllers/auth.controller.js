import * as authService from "../services/auth.service.js";
import catchAsync from "../utils/catch-async.js";


/* Register - controller */
const register = catchAsync(async (req, res) => {
  const registerBody = req.body;
  const response = await authService.register(registerBody);
  res.send(response);
});

/* Login - controller */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const response = await authService.login(email, password);
  res.send(response);
});

export { register, login };
