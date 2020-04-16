import { Component, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProductService, AuthenticationService } from '@app/_services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({ templateUrl: 'product_add_edit.component.html' })
export class ProductAddUpdateComponent {
  loading = false;
  products: any[];
  public submitted: boolean; // form submitted flag
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  constructor(private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder) {

  }
  product: any;
  _id: string;
  mode: string;
  Formdata: any;
  categories:any;
  push_image:string;
  pushImageSource:string;

  ngOnInit() {
    this.productService.getAllCategory()
        .pipe(first())
      .subscribe(resp => {
        console.log(resp);
        this.categories = resp;
      });
    this.route.params.subscribe(params => {
      this._id = params["id"];
      if (this._id) {
        this.mode = 'edit';
        this.productService.get(this._id)
          .pipe(first())
          .subscribe(resp => {
            this.product = resp;
            this.Formdata.patchValue({
              title: this.product.title,
              description: this.product.description,
              discount: this.product.discount,
              price: this.product.price,
              category:this.product.category._id
            });
          });

      } else {
        this.mode = 'add';
      }
    });

    this.Formdata = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required]],
      discount: ['', [Validators.required]],
      category: ['', [Validators.required]],
      image:[]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.Formdata.controls; }

  handleForm() {
    this.submitted = true;
    const data = this.Formdata.value;
    const formdata = new FormData();
    formdata.append('title', data.title);
    formdata.append('description', data.description);
    formdata.append('price', data.price);
    formdata.append('discount', data.discount);
    formdata.append('category', data.category);
    formdata.append('image', this.push_image);

    if (this.mode == 'add') {
      this.productService.add(formdata).subscribe(res => {
        this.router.navigate(['/']);
        this.toastr.success('Success', 'Product Saved');
      },err=>{
        if (err.status_code=422 && err.data) {
          err.data.map((v)=>{
            this.toastr.error(v.msg);
          })
        }
      });
    } else {
      this.productService.update(this._id, formdata).subscribe(res => {
        this.router.navigate(['/']);
        this.toastr.success('Success', 'Product Saved');
      },err=>{
        if (err.status_code=422 && err.data) {
          err.data.map((v)=>{
            this.toastr.error(v.msg);
          })
        }
      });
    }
  }

  onSelectFile(event) {
    const img = event;
    if (event.target.files && event.target.files[0]) {
      const filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[i]);
        reader.onload = (file: any) => {
          this.push_image = event.target.files[i];
          this.pushImageSource = ""+reader.result;
        };
      }
    }
  }
}
