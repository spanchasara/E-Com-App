import { Component, Input } from "@angular/core";
import { ProductImage } from "src/app/models/product.model";
import { ProductService } from "src/app/services/product.service";

@Component({
  selector: "app-product-images",
  templateUrl: "./product-images.component.html",
  styleUrls: ["./product-images.component.css"],
})
export class ProductImagesComponent {
  constructor(private productService: ProductService) {}

  @Input() imagesArray: ProductImage[] = [];
  @Input() productId: string = "";

  imageFiles: File[] = [];
  deleteVisible: boolean[] = [];
  deletedImages: any[] = [];
  showGrid: boolean = false;

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
    if (this.imagesArray?.[index]) {
      this.deletedImages.push(this.imagesArray[index].publicId);
    }
    this.imagesArray?.splice(index, 1);
  }

  removeImage(index: number, event: Event): void {
    this.imageFiles.splice(index, 1);
    this.deleteVisible.splice(index, 1);
  }

  saveBackendImages() {
    this.productService
      .deleteImages(this.deletedImages, this.productId)
      .subscribe();
  }
}
