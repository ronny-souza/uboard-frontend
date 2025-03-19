import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { v4 as uuidv4 } from 'uuid';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Credentials } from '../../core/models/credentials.model';
import { CustomInputFilterComponent } from '../../shared/components/custom-input-filter/custom-input-filter.component';
import { EmptyTableMessageComponent } from '../../shared/components/empty-table-message/empty-table-message.component';
import { UboardButtonComponent } from "../../shared/components/uboard-button/uboard-button.component";

@Component({
  selector: 'app-credentials',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    DatePipe,
    MatCardModule,
    MatIcon,
    MatButtonModule,
    CustomInputFilterComponent,
    EmptyTableMessageComponent,
    UboardButtonComponent
],
  templateUrl: './credentials.component.html',
  styleUrl: './credentials.component.scss',
})
export class CredentialsComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'type', 'createdAt', 'actions'];
  credentialsTableDataSource = new MatTableDataSource<Credentials>(
    ELEMENT_DATA
  );

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.credentialsTableDataSource.paginator = this.paginator;
  }

  applyFilter(value: string) {
    this.credentialsTableDataSource.filter = value.trim().toLowerCase();

    if (this.credentialsTableDataSource.paginator) {
      this.credentialsTableDataSource.paginator.firstPage();
    }
  }

  hasItems() {
    return this.credentialsTableDataSource.paginator?.length;
  }
}

const ELEMENT_DATA: Credentials[] = [
  {
    uuid: uuidv4(),
    name: 'Gitlab Public Credentials 1',
    type: 'GITLAB',
    createdAt: new Date(),
  },

  {
    uuid: uuidv4(),
    name: 'Gitlab Public Credentials 2',
    type: 'GITLAB',
    createdAt: new Date(),
  },

  {
    uuid: uuidv4(),
    name: 'Gitlab Public Credentials 3',
    type: 'GITLAB',
    createdAt: new Date(),
  },

  {
    uuid: uuidv4(),
    name: 'Gitlab Public Credentials 4',
    type: 'GITLAB',
    createdAt: new Date(),
  },

  {
    uuid: uuidv4(),
    name: 'Gitlab Public Credentials 5',
    type: 'GITLAB',
    createdAt: new Date(),
  },

  {
    uuid: uuidv4(),
    name: 'Gitlab Public Credentials 6',
    type: 'GITLAB',
    createdAt: new Date(),
  },

  {
    uuid: uuidv4(),
    name: 'Gitlab Public Credentials 7',
    type: 'GITLAB',
    createdAt: new Date(),
  },

  {
    uuid: uuidv4(),
    name: 'Gitlab Public Credentials 8',
    type: 'GITLAB',
    createdAt: new Date(),
  },

  {
    uuid: uuidv4(),
    name: 'Gitlab Public Credentials 9',
    type: 'GITLAB',
    createdAt: new Date(),
  },

  {
    uuid: uuidv4(),
    name: 'Gitlab Public Credentials 10',
    type: 'GITLAB',
    createdAt: new Date(),
  },
];
