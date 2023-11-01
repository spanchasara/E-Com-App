import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-pagination",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.css"],
})
export class PaginationComponent {
  @Input() totalItems: number = 0;
  @Input() page: number = 1;
  @Input() limit: number = 10;
  @Output() pageChange = new EventEmitter<number>();

  constructor() {}

  pageChanged(pageNumber: number) {
    this.pageChange.emit(pageNumber);
  }
}
