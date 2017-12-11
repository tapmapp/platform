import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// SERVICES
import { StoresService } from '../../services/stores/stores.service';

// INTERFACES
import { Stores } from '../../interfaces/stores.interface';

@Component({
  selector: 'display',
  providers: [],
  styleUrls: [ './display.component.css' ],
  templateUrl: './display.component.html'
})
export class DisplayComponent implements OnInit {

  lat: number = 51.678418;
  lng: number = 7.809007;

  stores: Array<Stores> = [];

  storesData: Observable<any>;

  constructor(private storesService: StoresService) {}

  ngOnInit() {

    // STORES SUBSCRIBER
    this.storesData = this.storesService.myStores;
    this.storesData.subscribe(data => {
      this.stores = data;
    });

  }

}
