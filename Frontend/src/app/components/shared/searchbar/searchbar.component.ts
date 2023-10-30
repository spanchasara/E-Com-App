import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductStore } from 'src/app/store/product.store';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css'],
})
export class SearchbarComponent implements OnInit {
  constructor(private productStore: ProductStore) {}

  sortOptions = {
    Default: '',
    'Price Low to High': 'price',
    'Price High to Low': '-price',
    'Name A to Z': 'title',
    'Name Z to A': '-title',
    'Newest Arrivals': '-createdAt',
  };
  selectedSortOption: string = 'Default';
  search: string = '';

  ngOnInit() {
    this.productStore.search$.subscribe((data) => {
      this.search = data;
    });

    this.productStore.sort$.subscribe((data) => {
      this.selectedSortOption = data;
    });
  }

  @Output() sortOption = new EventEmitter<string>();
  @Output() enteredSearch = new EventEmitter<string>();

  changeSort(e: Event) {
    const sort = (e.target as HTMLSelectElement).value;
    const sortValue = this.sortOptions[sort as keyof typeof this.sortOptions];
    this.sortOption.emit(sortValue);
    this.productStore.updateProductData({ sort });
  }

  getOptions() {
    return Object.keys(this.sortOptions);
  }

  onSubmit() {
    this.selectedSortOption = 'Default';
    this.enteredSearch.emit(this.search);
    this.productStore.updateProductData({
      search: this.search,
      sort: 'Default',
    });
  }

  onSearchChange(input: string) {
    if (input === '') {
      this.search = '';
      this.enteredSearch.emit('');
      this.selectedSortOption = 'Default';
      this.productStore.updateProductData({
        search: this.search,
        sort: this.selectedSortOption,
      });
    }
  }
}
