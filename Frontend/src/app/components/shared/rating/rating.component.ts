import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-rating",
  templateUrl: "./rating.component.html",
  styleUrls: ["./rating.component.css"],
})
export class RatingComponent {
  @Input() readonly = true;
  @Input() rating = 0;
  @Input() wantHalfStar = false;
  @Input() size = 20;

  @Output() ratingChange = new EventEmitter<number>();

  onRatingChange(rating: number) {
    if (this.readonly) {
      return;
    }

    this.rating = rating;
    this.ratingChange.emit(rating);
  }
}
