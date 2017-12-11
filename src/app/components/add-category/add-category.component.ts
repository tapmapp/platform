import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// SERVICES
import { CategoriesService } from '../../services/categories/categories.service';

// INTERFACES
import { Categories } from '../../interfaces/categories.interface';

@Component({
  selector: 'add-category',
  providers: [],
  styleUrls: [ './add-category.component.css' ],
  templateUrl: './add-category.component.html'
})
export class AddCategoryComponent implements OnInit {

  categoriesData: Observable<Array<Categories>>;

  categories: Array<Categories> = [];

  // COLUMN CHART DATA
  columnChartData:any =  {
    chartType: 'ColumnChart',
    dataTable: [
      ['Category', 'Num. of Items']
    ],
    options: {
      bar : { groupWidth: 120 },
      width : '100%',
      height : 300,
      bars : 'vertical',
      backgroundColor : '#fff',
      colors : ['#7bbcda'],
      chartArea : { 'left': 60, 'bottom': 30, 'right':0, 'top': 50 },
      hAxis: {
        slantedText : false,
        textStyle : {
          color: '#333',
          fontSize: 12
        },
        allowContainerBoundaryTextCufoff: false
      },
      vAxis: {
        baseline : 0,
        baselineColor : '#bbb',
        gridlines : {
          count: 4
        },
        minValue: 0,
        textStyle: {
          color: '#333',
          fontName: 'Arial',
          fontSize: 10,
          bold: false,
          italic: false
        }
      }
    }
  }

  pieChartData:any =  {
    chartType: 'PieChart',
    dataTable: [
      ['Category', 'Num. of Items']
    ],
    options: {
      width: '100%',
      height: 300, 
      colors: ['#efa1a1'],
      chartArea: { 'left': 60, 'bottom': 30, 'right':30, 'top': 50 },
      legend: 'none'
    }  
  };

  constructor(
    private categoriesService: CategoriesService) {}

  // LOAD CHART CATEGORIES
  loadChartCategories(categories) {

    let categoriesChartData = [['', 'Num. of Items']];

    for(let i = 0; i < categories.length; i++){
      categoriesChartData.push([categories[i].name, categories[i].items]);
    }

    this.pieChartData.dataTable = categoriesChartData;
    this.columnChartData.dataTable = categoriesChartData;
    
  }

  ngOnInit() {

    // CATEGORIES SUBSCRIBER
    this.categoriesData = this.categoriesService.myCategories;
    this.categoriesData.subscribe(data => {

      if(data.length > 0) {
        this.categories = data;

        if(this.categories.length > 0) {
          this.loadChartCategories(this.categories);
        }
      }
  
    });

  }

}
