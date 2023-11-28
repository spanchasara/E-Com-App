import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { NgForm, NumberValueAccessor } from "@angular/forms";
import { PaginatedProducts } from "src/app/models/product.model";
import { ProductService } from "src/app/services/product.service";
import { ProductStore } from "src/app/store/product.store";

@Component({
  selector: "app-filterbar",
  templateUrl: "./filterbar.component.html",
  styleUrls: ["./filterbar.component.css"],
})
export class FilterbarComponent {
  @ViewChild("f", { static: false })
  filterForm!: NgForm;

  @Output() changer = new EventEmitter<PaginatedProducts>();

  ratingOptions = [
    {
      label: "All",
      value: 0,
    },
    {
      label: ">4",
      value: 4,
    },
    {
      label: ">3",
      value: 3,
    },
    {
      label: ">2",
      value: 2,
    },
  ];

  constructor(private productService : ProductService, private productStore: ProductStore){}

  selectedRating = this.ratingOptions[0].value;
  onPriceFormSubmit() {
    this.productService.getProducts(false, {
      keyword: this.productStore.getValue().search,
      rating: this.filterForm.form.value.rating,
      minPrice: this.filterForm.form.value.minPrice,
      maxPrice: this.filterForm.form.value.maxPrice,
    }).subscribe((res) => 
      this.changer.emit(res)
    );
  }
}
