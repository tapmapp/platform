import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
 name: 'filterProductsByPipe'
})
export class FilterProductsByPipe implements PipeTransform {

  transform(myProducts: any, args: any) {
      
      if(args[0] != '') {

        myProducts = myProducts.filter(function(myProduct) {
          for(let j = 0; j < myProduct.lot.length; j++) {
            for(let k = 0; k < myProduct.lot[j].store.length; k++) {
              if(myProduct.lot[j].store[k] == args[0]) {
                return true;
              }
            }
          }
        });

      }

      if(args[1] != '') {
        myProducts = myProducts.filter(myProduct => myProduct.category._id.indexOf(args[1]) !== -1);
      }

      return myProducts;

  }

}