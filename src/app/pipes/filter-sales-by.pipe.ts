import { Pipe, PipeTransform } from '@angular/core';

// SERVICES
import { SalesService } from '../services/sales/sales.service';

// INTERFACES
import { FilterConfig } from '../interfaces/filter-config.interface';

@Pipe({
 name: 'filterSalesByPipe'
})
export class FilterSalesByPipe implements PipeTransform {

  constructor(private salesService: SalesService) {}

  transform(myTickets: any, args: FilterConfig) {

    if(args.searchedProduct == '') {

      if(args.storeId != '') {
        myTickets = myTickets.filter(myTicket => myTicket.storeId._id.indexOf(args.storeId) !== -1);
      }

      if(args.categoryId != '') {
        myTickets = myTickets.filter(function(myTicket) {
          for(let i = 0; i < myTicket.saleId.length; i++) {
            return myTicket.saleId[i].merchantProductId.category._id.indexOf(args.categoryId) !== -1
          }
        });
      }

      if(args.productId != '') {
        myTickets = myTickets.filter(function(myTicket) {
          for(let i = 0; i < myTicket.saleId.length; i++) {
            return myTicket.saleId[i].productId._id.indexOf(args.productId) !== -1
          }
        });
      }

      if(args.brandId != '') {
        myTickets = myTickets.filter(function(myTicket) {
          for(let i = 0; i < myTicket.saleId.length; i++) {
            return myTicket.saleId[i].productId.brand.indexOf(args.brandId) !== -1
          }
        });
      }

      if(args.userId != '') {
        myTickets = myTickets.filter(myTicket => myTicket.userId._id.indexOf(args.userId) !== -1);
      }

      if(args.genreId != '') {
        myTickets = myTickets.filter(myTicket => myTicket.userId.genre.indexOf(args.genreId) !== -1);
      }

      if(args.method != '') {
        myTickets = myTickets.filter(myTicket => myTicket.method.indexOf(args.method) !== -1);
      }

      this.salesService.sendChartSales(myTickets);

      return myTickets;

    } else {
      
    }

  }

}