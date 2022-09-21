import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  dialog = this.dialogGet();

  constructor(private matDialog: MatDialog) {}

  private dialogGet(): {
    open: <T, D = any, R = any>(component: ComponentType<T>, config?: MatDialogConfig<D>) => MatDialogRef<T, R>
  } {
    return {
      open: (component, config?) => this.matDialog.open(component, config)
    }
  }
}
