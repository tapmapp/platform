import { Component, OnInit, Input} from '@angular/core';
import { Observable, Subject } from 'rxjs';

// SERVICES
import { FilterConfigService } from '../../services/filter-config/filter-config.service';

// INTERFACES
import { FilterConfig } from '../../interfaces/filter-config.interface';

@Component({
  selector: 'clients-list',
  styleUrls: [ './clients-list.component.css' ],
  templateUrl: './clients-list.component.html',
  providers: []
})
export class ClientsListComponent implements OnInit {

  @Input('clients') clients: Array<any> = [];
  
  filterConfig = <FilterConfig>{};

  filterConfigData: Observable<FilterConfig>;

  constructor(
    private filterConfigService: FilterConfigService) {}

  // FILTER BY USER
  selectUser(userId) {

    this.filterConfig.userId = userId;

    // SET FILTER CONFIG
    this.filterConfigService.setConfig(this.filterConfig);

  };
  
  // FILTER BY GENRE
  selectGenre(genreId) {

    this.filterConfig.genreId = genreId;

    // SET FILTER CONFIG
    this.filterConfigService.setConfig(this.filterConfig);
  }

  ngOnInit() {

    // FILTER CONFIG SUBSCRIBER
    this.filterConfigData = this.filterConfigService.myFilterConfig;
    this.filterConfigData.subscribe(data => {

      this.filterConfig = data;

    });

  }

}
