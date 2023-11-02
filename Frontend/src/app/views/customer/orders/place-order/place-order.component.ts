import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent implements OnInit{
  currentOrder: string = '';
  toggleOrderPreview: boolean = false; 
  ngOnInit(): void {
    this.currentOrder = sessionStorage.getItem('currentOrder') || '';
  }
  showPreviewOrder(data: any){
    console.log(data);
    this.toggleOrderPreview = data;
  }
} 
