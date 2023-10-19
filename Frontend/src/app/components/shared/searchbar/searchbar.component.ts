import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css'],
})
export class SearchbarComponent {
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

  @Output() sortOption = new EventEmitter<string>();
  @Output() enteredSearch = new EventEmitter<string>();

  changeSort(e: Event) {
    const sort = (e.target as HTMLSelectElement).value;
    const sortValue = this.sortOptions[sort as keyof typeof this.sortOptions];
    this.sortOption.emit(sortValue);
  }

  getOptions() {
    return Object.keys(this.sortOptions);
  }

  onSubmit() {
    this.enteredSearch.emit(this.search);
  }

  onSearchChange(input: string) {
    if (input === '') {
      this.search = '';
      this.enteredSearch.emit('');
      this.selectedSortOption = 'Default';
    }
  }
}
