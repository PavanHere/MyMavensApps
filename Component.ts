import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  jsonString: string = '[{"id": 1, "name": "John Doe", "email": "john@example.com"}, {"id": 2, "name": "Jane Smith", "email": "jane@example.com"}, {"id": 3, "name": "Bob Johnson", "email": "bob@example.com"}]';
  userData: any[] = JSON.parse(this.jsonString);

  addRow() {
    const newRow = { id: null, name: '', email: '' };
    this.userData.push(newRow);
  }
}
