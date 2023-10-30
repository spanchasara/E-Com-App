import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from './components/footer/footer.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthInterceptor } from './utils/auth/authInterceptor.service';
import { ProductsComponent } from './components/products/products.component';
import { ProductComponent } from './components/product/product.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChangePasswordComponent } from './user-profile/change-password/change-password.component';
import { PaginationComponent } from './components/shared/pagination/pagination.component';
import { SearchbarComponent } from './components/shared/searchbar/searchbar.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { UsersListComponent } from './components/admin/users-list/users-list.component';
import { CarouselComponent } from './components/shared/carousel/carousel.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoaderComponent } from './components/shared/loader/loader.component';
import { CardComponent } from './components/shared/card/card.component';
import { ProductsListComponent } from './components/seller/products-list/products-list.component';
import { SellerDashboardComponent } from './components/seller/seller-dashboard/seller-dashboard.component';
import { PublicUserComponent } from './components/public-user/public-user.component';
import { AddProductComponent } from './components/seller/add-product/add-product.component';
import { EditProductComponent } from './components/seller/edit-product/edit-product.component';
import { ProductFormComponent } from './components/seller/product-form/product-form.component';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { CartComponent } from './components/cart/cart.component';
import { AddressComponent } from './components/customer/address/address.component';
import { AddressFormComponent } from './components/customer/address/address-form/address-form.component';
import { AddAddressComponent } from './components/customer/address/add-address/add-address.component';
import { EditAddressComponent } from './components/customer/address/edit-address/edit-address.component';
import { AddressListComponent } from './components/customer/address/address-list/address-list.component';

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
    NotAuthorizedComponent,
    CartComponent,
    AddressComponent,
    AddressFormComponent,
    AddAddressComponent,
    EditAddressComponent,
    AddressListComponent,
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
