import { Component, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Product } from '@app/_models';
import { ProductService, AuthenticationService } from '@app/_services';
import { plainToClass } from 'class-transformer';

@Component({ templateUrl: 'product_view.component.html' })
export class ProductViewComponent {
  loading = false;
  products: any[];
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  constructor(private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router) {

  }
  product: any;
  _id: string;
  ngOnInit() {
    this.route.params.subscribe(params => {
      this._id = params["id"];
      this.productService.get(this._id)
        .pipe(first())
        .subscribe(resp => {
          this.product = resp;
        });
    });

  }
}
