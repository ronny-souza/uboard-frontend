import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar(
    message: string,
    horizontalPosition: MatSnackBarHorizontalPosition = 'end',
    verticalPosition: MatSnackBarVerticalPosition = 'top',
    duration: number = 5000
  ) {
    const content = message;
    this._snackBar.open(content, 'X', {
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
      duration: duration,
    });
  }
}
