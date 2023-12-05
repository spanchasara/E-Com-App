import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./views/common/login/login.component";
import { RegisterComponent } from "./views/common/register/register.component";
import { WelcomePageComponent } from "./views/customer/welcome-page/welcome-page.component";
import { authGuard } from "./guards/auth.guard";
import { UserProfileComponent } from "./views/common/user-profile/user-profile.component";
import { ProductsComponent } from "./views/common/products/products.component";
import { ProductComponent } from "./views/common/product/product.component";
import { AdminDashboardComponent } from "./views/admin/admin-dashboard.component";
import { NotFoundComponent } from "./views/common/not-found/not-found.component";
import { adminGuard } from "./guards/admin.guard";
import { SellerDashboardComponent } from "./views/seller/seller-dashboard.component";
import { PublicUserComponent } from "./views/admin/public-user/public-user.component";
import { AddProductComponent } from "./views/seller/add-product/add-product.component";
import { EditProductComponent } from "./views/seller/edit-product/edit-product.component";
import { CartComponent } from "./views/customer/cart/cart.component";
import { AddAddressComponent } from "./views/customer/orders/place-order/address/add-address/add-address.component";
import { EditAddressComponent } from "./views/customer/orders/place-order/address/edit-address/edit-address.component";
import { ProductsListComponent } from "./views/seller/products-list/products-list.component";
import { homeGuard } from "./guards/home.guard";
import { sellerGuard } from "./guards/seller.guard";
import { customerGuard } from "./guards/customer.guard";
import { UsersListComponent } from "./views/admin/users-list/users-list.component";
import { SellerOrdersComponent } from "./views/seller/orders/seller-orders.component";
import { AdminOrdersComponent } from "./views/admin/orders/admin-orders.component";
import { AllOrdersComponent } from "./views/customer/orders/all-orders/all-orders.component";
import { PlaceOrderComponent } from "./views/customer/orders/place-order/place-order.component";
import { StatusComponent } from "./components/status/status.component";
import { ResetPasswordComponent } from "./views/common/reset-password/reset-password.component";
import { CouponsListComponent } from "./views/admin/coupons-list/coupons-list.component";
import { CouponFormComponent } from "./views/admin/coupon-form/coupon-form.component";
import { FeedbackComponent } from "./views/customer/feedback/feedback.component";
import { AnalyticsComponent } from "./views/common/analytics/analytics.component";

const routes: Routes = [
  {
    path: "",
    component: WelcomePageComponent,
    canActivate: [homeGuard],
  },
  {
    path: "cart",
    component: CartComponent,
  },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [authGuard],
  },
  {
    path: "register",
    component: RegisterComponent,
    canActivate: [authGuard],
  },
  {
    path: "reset-password",
    component: ResetPasswordComponent,
    canActivate: [authGuard],
  },
  {
    path: "user",
    component: UserProfileComponent,
    canActivate: [authGuard],
  },
  {
    path: "user/:id",
    component: PublicUserComponent,
    canActivate: [authGuard],
  },
  {
    path: "products",
    component: ProductsComponent,
  },
  {
    path: "products/:id",
    component: ProductComponent,
  },
  {
    path: "status",
    component: StatusComponent,
    canActivate: [authGuard, customerGuard],
  },
  {
    path: "feedback",
    component: FeedbackComponent,
    canActivate: [authGuard, customerGuard],
  },
  {
    path: "admin",
    component: AdminDashboardComponent,
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: "users",
      },
      {
        path: "users",
        component: UsersListComponent,
      },
      {
        path: "orders",
        component: AdminOrdersComponent,
      },
      {
        path: "coupons",
        component: CouponsListComponent,
      },
      {
        path: "coupons/add",
        component: CouponFormComponent,
      },
      {
        path: "coupons/edit/:id",
        component: CouponFormComponent,
      },
      {
        path: "analytics",
        component: AnalyticsComponent,
        data: {
          type: "admin",
        },
      },
    ],
  },
  {
    path: "seller",
    component: SellerDashboardComponent,
    canActivate: [authGuard, sellerGuard],
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: "products",
      },
      {
        path: "products",
        component: ProductsListComponent,
      },
      {
        path: "products/add",
        component: AddProductComponent,
      },
      {
        path: "products/edit/:id",
        component: EditProductComponent,
      },
      {
        path: "orders",
        component: SellerOrdersComponent,
      },
      {
        path: "analytics",
        component: AnalyticsComponent,
        data: {
          type: "seller",
        },
      },
    ],
  },
  {
    path: "address/add",
    component: AddAddressComponent,
    canActivate: [authGuard, customerGuard],
  },
  {
    path: "address/edit/:id",
    component: EditAddressComponent,
    canActivate: [authGuard, customerGuard],
  },
  {
    path: "orders",
    component: AllOrdersComponent,
    canActivate: [authGuard, customerGuard],
  },
  {
    path: "place-order",
    component: PlaceOrderComponent,
    canActivate: [authGuard, customerGuard],
  },
  { path: "**", component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
