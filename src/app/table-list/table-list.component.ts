import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { COMMA, TAB, SPACE, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';

export interface PeriodicElement {
  vesselid: number;
  vesselname: string;
  vesselcode: string;
  vesseltype:  string;
  maxteus: number;
  cargotype: string;
  status: boolean;
}

export interface SearchItem {
  name: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { vesselid: 123, vesselname: 'Khang Shun', vesselcode: 'M6X6', vesseltype: 'Dry Bulk', maxteus: 8000, cargotype: 'Coal', status: true },
   { vesselid: 124, vesselname: 'Niran Shun', vesselcode: 'M6X6', vesseltype: 'Navy', maxteus: 8000, cargotype: 'Coal', status: true },
    { vesselid: 125, vesselname: 'Shun Shun', vesselcode: 'M6X6', vesseltype: 'Tug', maxteus: 8000, cargotype: 'Coal', status: true },
     { vesselid: 126, vesselname: 'Grei Shun', vesselcode: 'M6X6', vesseltype: 'Dry Bulk', maxteus: 8000, cargotype: 'Coal', status: true },
      { vesselid: 127, vesselname: 'Wang Shun', vesselcode: 'M6X6', vesseltype: 'Dry Bulk', maxteus: 8000, cargotype: 'Coal', status: true },
  
];

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {

  constructor() { }

  displayedColumns: string[] = ['vesselid', 'vesselname', 'vesselcode', 'vesseltype', 'maxteus', 'cargotype', 'status'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  positionFilter = new FormControl();
  nameFilter = new FormControl();
  private filterValues = { id: '', name: '' }

  filteredValues = {
    position: '', name: '', weight: '',
    symbol: '', topFilter: false
  };

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [COMMA, TAB, ENTER];
  searchItems: SearchItem[] = [];

  ngOnInit() {

    this.positionFilter.valueChanges.subscribe((positionFilterValue) => {
      console.log(positionFilterValue);

      this.filteredValues['position'] = positionFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.filteredValues['topFilter'] = false;
    });


    this.nameFilter.valueChanges
      .subscribe(value => {
        this.filterValues['name'] = value
        this.dataSource.filter = JSON.stringify(this.filterValues)
      });
    this.dataSource.filterPredicate = this.createFilter();
  }

    add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    console.log('event', event);

    // Add our fruit
    if ((value || '').trim()) {
      this.searchItems.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(item: SearchItem): void {
    const index = this.searchItems.indexOf(item);

    if (index >= 0) {
      this.searchItems.splice(index, 1);
    }
  }


  applyFilter(filterValue: string) {
    let filter = {
      name: filterValue.trim().toLowerCase(),
      position: filterValue.trim().toLowerCase(),
      topFilter: true
    }
    this.dataSource.filter = JSON.stringify(filter)
  }

  createFilter() {
    let filterFunction = function (data: any, filter: string): boolean {
      let searchTerms = JSON.parse(filter)
      let idSearch = data.id.toString().indexOf(searchTerms.id) != -1
      let nameSearch = () => {
        let found = false;
        searchTerms.name.trim().toLowerCase().split(' ').forEach(word => {
          if (data.name.toLowerCase().indexOf(word) != -1) { found = true }
        });
        return found
      }
      return idSearch && nameSearch()
    }
    return filterFunction
  }

}
