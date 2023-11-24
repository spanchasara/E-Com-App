import { Injectable } from "@angular/core";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class SwalService {
  constructor() {}

  error(message: string) {
    if (message === "jwt expired") {
      message = "Session Expired !! Please Login Again !!";
    }

    Swal.fire({
      title: "Error",
      html: message || "Something went wrong !!",
      icon: "error",
      toast: true,
      showConfirmButton: false,
      position: "top-end",
      timer: 3000,
      timerProgressBar: true,
    });
  }

  success(message: string) {
    Swal.fire({
      title: "Success",
      html: message,
      icon: "success",
      toast: true,
      showConfirmButton: false,
      position: "top-end",
      timer: 3000,
      timerProgressBar: true,
    });
  }

  info(message: string) {
    Swal.fire({
      title: "Info",
      html: message,
      icon: "info",
      toast: true,
      showConfirmButton: false,
      position: "top-end",
      timer: 3000,
      timerProgressBar: true,
    });
  }

  warning(message: string) {
    Swal.fire({
      title: "Warning",
      html: message,
      icon: "warning",
      toast: true,
      showConfirmButton: false,
      position: "top-end",
      timer: 3000,
      timerProgressBar: true,
    });
  }

  confirmWarning(message: string) {
    return Swal.fire({
      title: "Warning",
      html: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
  }
}
