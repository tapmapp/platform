import { Component, OnInit, Input} from '@angular/core';

// SERVICES
import { FilterConfigService } from '../../services/filter-config/filter-config.service';

// INTERFACES
import { FilterConfig } from '../../interfaces/filter-config.interface';

@Component({
  selector: 'buy-clients-list',
  styleUrls: [ './buy-clients-list.component.css' ],
  templateUrl: './buy-clients-list.component.html',
  providers: []
})
export class BuyClientsListComponent implements OnInit {

  @Input('clients') clients: Array<any> = [];

  filterConfig = <FilterConfig>{};

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

  ngOnInit() {}

}
