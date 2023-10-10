import { identityService } from "../../services/index.js";
import catchAsync from "../../utils/catch-async.js";

const { authService } = identityService;

/* Signup - controller */
const signup = catchAsync(async (req, res) => {
  const signupBody = req.body;
  const response = await authService.signup(signupBody);
  res.send(response);
});

/* Login - controller */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const response = await authService.login(email, password);
  res.send(response);
});

export { signup, login };
