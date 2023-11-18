import { AfterViewInit, Component, Input, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Product } from "src/app/models/product.model";
import { ProductService } from "src/app/services/product.service";
import { UserStore } from "src/app/store/user-store";

interface Specification {
  [key: string]: string;
}

@Component({
  selector: "app-product-form",
  templateUrl: "./product-form.component.html",
  styleUrls: ["./product-form.component.css"],
})
export class ProductFormComponent implements AfterViewInit {
  @ViewChild("f", { static: false })
  productForm!: NgForm;
  @Input() editMode: boolean = false;
  @Input() productId: string = "";
  @Input() product: Product = {
    title: "",
    description: "",
    stock: 0,
    price: 0,
    specifications: {},
    sellerId: "",
  };
  currentUserId: string = "";
  specifications: Specification[] = [];

  constructor(
    private productService: ProductService,
    private router: Router,
    private userStore: UserStore
  ) {}

  ngAfterViewInit(): void {
    this.currentUserId = this.userStore.getValue().user?._id || "";
    if (
      this.currentUserId != "" &&
      this.product.sellerId !== "" &&
      this.currentUserId != this.product.sellerId
    ) {
      this.router.navigate(["/"]);
    }
    if (this.editMode && this.product.specifications) {
      this.revertToSpecifications(this.product.specifications as Specification);
    }
  }

  deleteSpecification(index: number) {
    this.specifications = [
      ...this.specifications.slice(0, index),
      ...this.specifications.slice(index + 1),
    ];
  }

  addSpecification() {
    if (this.specifications.length === 0)
      this.specifications.push({ key: "", value: "" });

    if (
      this.specifications[this.specifications.length - 1]["key"] === "" ||
      this.specifications[this.specifications.length - 1]["value"] === ""
    )
      return;

    this.specifications.push({ key: "", value: "" });
  }

  onSubmit() {
    if (
      this.specifications.length > 0 &&
      this.specifications[0]["key"] === "" &&
      this.specifications[0]["value"] === ""
    ) {
      this.specifications = [];
    }

    const productForm = {
      title: this.productForm.form.value?.productName,
      description: this.productForm.form.value?.productDescription,
      stock: this.productForm.form.value?.productStock,
      price: this.productForm.form.value?.productPrice,
      specifications: this.getSpecifications(),
      sellerId: this.userStore.getValue().user?._id || "",
    };
    this.product = productForm;
    if (!this.editMode)
      this.productService.addProduct(this.product).subscribe();
    else
      this.productService.editProduct(this.productId, this.product).subscribe();
  }

  getSpecifications() {
    const result: Specification = {};
    this.specifications.forEach((spec) => {
      result[spec["key"]] = spec["value"];
    });
    return result;
  }

  revertToSpecifications(specifications: Specification) {
    const revspecifications: Specification[] = [];

    for (const key in this.product.specifications) {
      revspecifications.push({ key, value: specifications[key] });
    }
    this.specifications = revspecifications;
  }
}
