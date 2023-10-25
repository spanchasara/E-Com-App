import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent {
  @Input() totalItems: number = 0;
  @Input() page: number = 1;
  @Output() pageChange = new EventEmitter<number>();
  limit: number = 10;

  constructor() {}

  pageChanged(pageNumber: number) {
    this.pageChange.emit(pageNumber);
  }
}
