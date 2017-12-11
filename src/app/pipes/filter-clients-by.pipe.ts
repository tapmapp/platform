import { OnInit, Pipe, PipeTransform } from '@angular/core';

// SERVICES
import { ClientsService } from '../services/clients/clients.service';
import { StoresService } from '../services/stores/stores.service';

// INTERFACES
import { Stores } from '../interfaces/stores.interface';

@Pipe({
 name: 'filterClientsByPipe'
})
export class FilterClientsByPipe implements PipeTransform {

  stores: Array<Stores> = [];

  constructor(
    private clientsService: ClientsService,
    private storesService: StoresService) {}

  transform(myClients: any, args: any) {

    // selectedStoreId, selectedCategoryId, selectedProductId, genreId, searchedProduct
    if(args[4] == '') {

      let stores = this.storesService.getStoresStore();

      if(args[0] != '') {

        myClients = myClients.filter(function(myClient) {
          for(let i = 0; i <  myClient.storeId.length; i++) {
            if(myClient.storeId[i] == args[0]) {

              for(let j = 0; j < stores.length; j++) {
                if(myClient.storeId[i] == stores[j]._id) {
  
                  let distance = getDistance(stores[j].lat, stores[j].long, myClient.lat, myClient.long);
                  myClient.distance = distance;

                }
              }

              return myClient;

            }

          }
        });
        
      }

      if(args[1] != '') {
        myClients = myClients.filter(myClient => myClient.merchantProductId.category._id.indexOf(args[1]) !== -1);
      }

      if(args[2] != '') {
        myClients = myClients.filter(myClient => myClient.merchantProductId._id.indexOf(args[2]) !== -1);
      }

      if(args[3] != '') {
        myClients = myClients.filter(myClient => myClient.genre.indexOf(args[3]) !== -1);
      }

      if(myClients.length > 0) {
        this.clientsService.sendClients(myClients);
      }

      return myClients;

    } else {
      
    }

    // GET DISTANCE BETWEEN ADDRESS AND STORE
    function getDistance(clientlat, clientlong, storeLat, storeLong) {

      if(storeLat != null && storeLong != null) {

        // EARTH RADIUS IN METTERS
        let R = 6378137; 

        // LAT, LONG DIFFERENCES
        let dLat = rad(clientlat - storeLat);
        let dLong = rad(clientlong - storeLong);

        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(rad(storeLat)) * Math.cos(rad(clientlat)) *
          Math.sin(dLong / 2) * Math.sin(dLong / 2);

        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let distance = R * c;

        return (distance / 1000).toFixed(1) + ' km';

      } else {
        return 'N/A';
      }

      function rad(x) {
        return x * Math.PI / 180;
      };

    }

  }
}