import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const customerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentPath = route.url[0]?.path.toLowerCase();
  if (authService.checkRole("customer")) {
    if (
      ["place-order"].includes(currentPath) &&
      (!sessionStorage.getItem("currentOrder") ||
        sessionStorage.getItem("currentOrder") === "")
    ) {
      return router.navigate(["/orders"]);
    }
    return true;
  } else {
    return router.navigate(["/"]);
  }
};
