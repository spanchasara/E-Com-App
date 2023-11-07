import {
  AfterViewInit,
  Component,
  Input,
  Renderer2,
  OnInit,
  ViewChild,
} from "@angular/core";
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
  showGrid: boolean = false;
  imageFiles: File[] = [];
  deleteVisible: boolean[] = [];
  deletedImages: any[] = [];
  imagesArrayLength = 0;

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
    this.imagesArrayLength = this.product.images?.length || 0;
    console.log(this.product.images)
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

  onSubmitImageForm() {
    const formData = new FormData();
    for (const file of this.imageFiles) {
      formData.append("images", file);
    }
    this.productService.saveImages(formData, this.productId).subscribe();
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.imageFiles.push(files[i]);
      }
    }
    this.showGrid = true;
  }
  getPreviewURL(file: File): string {
    return URL.createObjectURL(file);
  }

  toggleDelete(index: number, show: boolean): void {
    this.deleteVisible[index] = show;
  }
  removeProductImage(index: number, event: Event): void {
    if (this.product.images?.[index]){
      this.deletedImages.push(this.product.images[index].publicId);    
    }
    this.product.images?.splice(index, 1);
  }
  removeImage(index: number, event: Event): void {
    this.imageFiles.splice(index, 1);
    this.deleteVisible.splice(index, 1);
  }
  saveBackendImages(){
    this.productService.deleteImages(this.deletedImages, this.productId).subscribe();
    console.log(this.deletedImages)
  }
}
