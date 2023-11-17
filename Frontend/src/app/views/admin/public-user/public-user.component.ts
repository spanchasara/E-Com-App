import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { User } from "src/app/models/user.model";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-public-user",
  templateUrl: "./public-user.component.html",
  styleUrls: ["./public-user.component.css"],
})
export class PublicUserComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  user!: User | null;
  isAdmin: boolean = false;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id") || "";
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        this.router.navigate(["/not-found"]);
      } else {
        this.userService.getPublicUser(id).subscribe((data) => {
          this.user = data;
          this.isAdmin = data.role === "admin";
        });
      }
    });
  }

  toggleAdmin(userId: string) {
    this.userService.toggleAdmin(userId, !this.isAdmin).subscribe((data) => {
      this.user = data;
      this.isAdmin = data.role === "admin";
    });
  }
}
