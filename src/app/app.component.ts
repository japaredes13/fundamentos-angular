import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Bienvenidos a Angular';
  curso: string = 'Spring con Angular';
  profesor: string = 'Javier Paredes';
}
