import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  exports: [
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule
  ]
})
export class MaterialModule {}
