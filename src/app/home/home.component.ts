import { Component } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Product, Products } from '../types';
import { ProductComponent } from '../components/product/product.component';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { EditPopupComponent } from '../components/edit-popup/edit-popup.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductComponent,CommonModule,PaginatorModule,EditPopupComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {

  constructor(private productsService: ProductsService) {}

   
  products:Product[]= [];
  totalRecords:number = 0
  rows:number = 5
  displayEditPopup:boolean = false
  displayAddPopup:boolean=false
  selectedProduct:Product = {
    price:'',
    name:'',
    image:'',
    rating:0,
    id:0,
  }

toggleEditPopup(product:Product){
  this.selectedProduct = product
  this.displayEditPopup = true
}
toggleAddPopup(){

  this.displayAddPopup = true
}
toggleDeletePopup(product:Product){
  this.selectedProduct = product
  this.displayAddPopup = true
}

onConfirmEdit(product:Product){
  if(!this.selectedProduct.id){
    return
  }
  this.editProduct(product, this.selectedProduct.id)
  this.displayEditPopup = false
}
onConfirmAdd(product:Product){
  if(!this.selectedProduct.id){
    return
  }
  this.editProduct(product, this.selectedProduct.id )
  this.displayAddPopup = false
}
  fetchProducts(page:number, perPage:number){
    this.productsService.getProducts('http://localhost:3000/clothes', { page: page, perPage: perPage})
    .subscribe((products:Products)=>{
      this.products=products.items;
      this.totalRecords = products.total
    })
  }

  onPageChange(event:any){
    this.fetchProducts(event.page,event.rows)
  }

  ngOnInit() {
 this.fetchProducts(0,this.rows)
}
addProduct(product:Product){
  this.productsService.addProduct(`http://localhost:3000/clothes`,product).subscribe(
    {
      next:(data)=>console.log(data),
      error:(error)=>console.log(error)
      
    }
  )
}

deleteProduct(product:Product,id:number){
  this.productsService.deleteProduct(`http://localhost:3000/clothes/${id}`,product).subscribe(
    {
      next:(data)=>console.log(data),
      error:(error)=>console.log(error)
      
    }
  )
}

editProduct(product:Product,id:number){
  this.productsService.editProduct(`http://localhost:3000/clothes/${id}`,product).subscribe(
    {
      next:(data)=>console.log(data),
      error:(error)=>console.log(error)
      
    }
  )

}



}
