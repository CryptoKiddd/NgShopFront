import { Component, ViewChild } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Product, Products } from '../types';
import { ProductComponent } from '../components/product/product.component';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { EditPopupComponent } from '../components/edit-popup/edit-popup.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductComponent,CommonModule,PaginatorModule,EditPopupComponent,ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {

  constructor(private productsService: ProductsService) {}

     
  @ViewChild('paginator') paginator:Paginator | undefined
   
  products:Product[]= [];
  totalRecords:number = 0
  rows:number = 10
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

  if(!product.id){
    return
  }
  this.deleteProduct(product,product.id)


}


onConfirmEdit(product:Product){
  if(!this.selectedProduct.id){
    return
  }
  this.editProduct(product, this.selectedProduct.id)
  this.displayEditPopup = false
}


onCancelEdit(){
  this.displayEditPopup = false
}

onConfirmAdd(product:Product){
 
  this.addProduct(product)
  this.displayAddPopup = false
}




  fetchProducts(page:number, perPage:number){
    this.productsService.getProducts('https://main--shopcommercebackend.netlify.app/clothes', { page: page, perPage: perPage})
    .subscribe((products:Products)=>{
      this.products=products.items;
      this.totalRecords = products.total
    })
  }

  onPageChange(event:any){
    this.fetchProducts(event.page,event.rows)
  }

  resetPaginator(){
    this.paginator?.changePage(0)
  }

  ngOnInit() {
 this.fetchProducts(0,this.rows)
}





addProduct(product:Product){
  this.productsService.addProduct(`https://main--shopcommercebackend.netlify.app/clothes`,product).subscribe(
    {
      next:(data)=>console.log(data),
      error:(error)=>console.log(error)
      
    }
  )
}

deleteProduct(product:Product,id:number){
  this.productsService.deleteProduct(`https://main--shopcommercebackend.netlify.app/clothes/${id}`,product).subscribe(
    {
      next:()=>{
        this.fetchProducts(0,this.rows);
        this.resetPaginator()
      },
      error:(error)=>console.log(error)
      
    }
  )
}

editProduct(product:Product,id:number){
  this.productsService.editProduct(`https://main--shopcommercebackend.netlify.app/clothes/${id}`,product).subscribe(
    {
      next:()=>{
        this.fetchProducts(0,this.rows);
        this.resetPaginator()

      },
      error:(error)=>console.log(error)
      
    }
  )

}



}
