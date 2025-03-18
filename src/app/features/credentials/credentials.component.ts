import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Credentials } from '../../shared/models/credentials.model';
import { v4 as uuidv4 } from 'uuid';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-credentials',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    DatePipe,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIcon,
    MatButtonModule
  ],
  templateUrl: './credentials.component.html',
  styleUrl: './credentials.component.scss',
})
export class CredentialsComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'type', 'createdAt'];
  credentialsTableDataSource = new MatTableDataSource<Credentials>(
    ELEMENT_DATA
  );

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.credentialsTableDataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.credentialsTableDataSource.filter = filterValue.trim().toLowerCase();

    if (this.credentialsTableDataSource.paginator) {
      this.credentialsTableDataSource.paginator.firstPage();
    }
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
