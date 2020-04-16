import { Component, ViewChild} from '@angular/core';
import { first } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Product } from '@app/_models';
import { ProductService, AuthenticationService } from '@app/_services';
import {plainToClass} from 'class-transformer';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    loading = false;
    products: any[];
    dtOptions: DataTables.Settings = {};
    @ViewChild(DataTableDirective, {static:false})
    datatableElement: DataTableDirective;

    constructor(private productService: ProductService, private toastr: ToastrService) { }
    filter={
      query:'',
      min_price:'',
      max_price:'',
    }
    ngOnInit() {
        this.loading = true;
        this.dtOptions = {
          pagingType: 'full_numbers',
          pageLength: 10,
          serverSide: true,
          searching: false,
          autoWidth: false,
          processing: true,
          order: [[0, 'desc']],
          dom: '<\'table-responsive\' tr> p',
          ajax: (dataTablesParameters: any, callback) => {
            const requestObject = {
              start: dataTablesParameters.start,
              length: dataTablesParameters.start + dataTablesParameters.length,
              query: this.filter.query,
              min_price: this.filter.min_price,
              max_price: this.filter.max_price,
            }
            this.productService.getAll(requestObject)
              .pipe(first())
              .subscribe(resp => {
                this.products = resp.docs;
                callback({
                  recordsTotal: resp.totalDocs,
                  recordsFiltered: resp.totalDocs,
                  data: []
                });
              });
          },
          columns: [{
            title: 'Title',
            data: 'title'
          }, {
            title: 'Category',
            data: 'category'
          }, {
            title: 'Price',
            data: 'price'
          }, {
            title: 'Discount',
            data: 'discount'
          }, {
            title: 'Netprice',
            data: 'netprice'
          }, {
            title: 'Created At',
            data: 'createdAt'
          }
          ]
        };
      }

      delete(id) {
        this.productService.delete(id)
        .pipe(first())
        .subscribe(resp => {
          this.rerender();
          this.toastr.success('Success', 'Product Deleted');
        });
      }

      rerender(): void {
        this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.draw();
        });
      }
}
