import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterComponent } from './views/common/register/register.component';
import { LoginComponent } from './views/common/login/login.component';
import { FooterComponent } from './components/footer/footer.component';
import { WelcomePageComponent } from './views/customer/welcome-page/welcome-page.component';
import { UserProfileComponent } from './views/common/user-profile/user-profile.component';
import { ProductsComponent } from './views/common/products/products.component';
import { ProductComponent } from './views/common/product/product.component';
import { ChangePasswordComponent } from './views/common/user-profile/change-password/change-password.component';
import { PaginationComponent } from './components/shared/pagination/pagination.component';
import { SearchbarComponent } from './components/shared/searchbar/searchbar.component';
import { AdminDashboardComponent } from './views/admin/admin-dashboard.component';
import { UsersListComponent } from './views/admin/users-list/users-list.component';
import { CarouselComponent } from './components/shared/carousel/carousel.component';
import { NotFoundComponent } from './views/common/not-found/not-found.component';
import { LoaderComponent } from './components/shared/loader/loader.component';
import { CardComponent } from './components/shared/card/card.component';
import { ProductsListComponent } from './views/seller/products-list/products-list.component';
import { SellerDashboardComponent } from './views/seller/seller-dashboard.component';
import { PublicUserComponent } from './views/admin/public-user/public-user.component';
import { AddProductComponent } from './views/seller/add-product/add-product.component';
import { EditProductComponent } from './views/seller/edit-product/edit-product.component';
import { ProductFormComponent } from './views/seller/product-form/product-form.component';
import { CartComponent } from './views/customer/cart/cart.component';
import { AddressComponent } from './views/customer/address/address.component';
import { AddressFormComponent } from './views/customer/address/address-form/address-form.component';
import { AddAddressComponent } from './views/customer/address/add-address/add-address.component';
import { EditAddressComponent } from './views/customer/address/edit-address/edit-address.component';
import { AddressListComponent } from './views/customer/address/address-list/address-list.component';
import { CartListComponent } from './views/customer/cart/cart-list/cart-list.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { SellerOrdersComponent } from './views/seller/orders/seller-orders.component';
import { OrderCardComponent } from './components/shared/order-card/order-card.component';
import { AdminOrdersComponent } from './views/admin/orders/admin-orders.component';
import { CustomerOrdersComponent } from './views/customer/orders/customer-orders.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RegisterComponent,
    LoginComponent,
    FooterComponent,
    WelcomePageComponent,
    UserProfileComponent,
    ProductsComponent,
    ProductComponent,
    ChangePasswordComponent,
    PaginationComponent,
    SearchbarComponent,
    AdminDashboardComponent,
    UsersListComponent,
    CarouselComponent,
    NotFoundComponent,
    LoaderComponent,
    CardComponent,
    ProductsListComponent,
    SellerDashboardComponent,
    PublicUserComponent,
    AddProductComponent,
    EditProductComponent,
    ProductFormComponent,
    CartComponent,
    AddressComponent,
    AddressFormComponent,
    AddAddressComponent,
    EditAddressComponent,
    AddressListComponent,
    CartListComponent,
    SellerOrdersComponent,
    AdminOrdersComponent,
    OrderCardComponent,
    CustomerOrdersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    SweetAlert2Module.forRoot(),
    AkitaNgDevtools.forRoot(),
    NgbCarouselModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
