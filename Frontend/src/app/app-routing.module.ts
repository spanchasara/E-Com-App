import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { AuthGuard } from './guards/auth.guard';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductComponent } from './components/product/product.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AdminGuard } from './guards/admin.guard';
import { SellerDashboardComponent } from './components/seller/seller-dashboard/seller-dashboard.component';
import { PublicUserComponent } from './components/public-user/public-user.component';
import { AddProductComponent } from './components/seller/add-product/add-product.component';
import { EditProductComponent } from './components/seller/edit-product/edit-product.component';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { CartComponent } from './components/cart/cart.component';
import { AddAddressComponent } from './components/customer/address/add-address/add-address.component';
import { EditAddressComponent } from './components/customer/address/edit-address/edit-address.component';
import { AddressComponent } from './components/customer/address/address.component';
import { ProductsListComponent } from './components/seller/products-list/products-list.component';
import { HomeGuard } from './guards/home.guard';
import { SellerGuard } from './guards/seller.guard';
import { CustomerGuard } from './guards/customer.guard';
import { UsersListComponent } from './components/admin/users-list/users-list.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomePageComponent,
    canActivate: [HomeGuard],
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user/:id',
    component: PublicUserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: 'products/:id',
    component: ProductComponent,
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, AdminGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'users',
      },
      {
        path: 'users',
        component: UsersListComponent,
      },
    ],
  },
  {
    path: 'seller',
    component: SellerDashboardComponent,
    canActivate: [AuthGuard, SellerGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'products',
      },
      {
        path: 'products',
        component: ProductsListComponent,
      },
      {
        path: 'products/add',
        component: AddProductComponent,
      },
      {
        path: 'products/edit/:id',
        component: EditProductComponent,
      },
    ],
  },
  {
    path: 'address',
    component: AddressComponent,
    canActivate: [AuthGuard, CustomerGuard],
  },
  {
    path: 'address/add',
    component: AddAddressComponent,
    canActivate: [AuthGuard, CustomerGuard],
  },
  {
    path: 'address/edit/:id',
    component: EditAddressComponent,
    canActivate: [AuthGuard, CustomerGuard],
  },
  {
    path: 'not-authorized',
    component: NotAuthorizedComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
