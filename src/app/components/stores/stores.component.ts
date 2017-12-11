import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// SERVICES
import { StoresService } from '../../services/stores/stores.service';

// INTERFACES
import { Stores } from '../../interfaces/stores.interface';

@Component({
  selector: 'stores',
  providers: [],
  styleUrls: [ './stores.component.css' ],
  templateUrl: './stores.component.html'
})
export class StoresComponent implements OnInit {

  stores: Array<Stores> = [];

  storesData: Observable<any>;

  lat: number = 51.678418;
  lng: number = 7.809007;

  constructor(
    private storesService: StoresService) {

    this.storesService.getStores();

  }

  ngOnInit() {

    this.storesData = this.storesService.myStores;
    this.storesData.subscribe(data => {
      this.stores = data;
    });
    
  }

}
