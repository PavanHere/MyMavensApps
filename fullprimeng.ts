export interface Affidavit {
  affidavitType: string | null;
  affidavitName: string | null;
  notary: string | null;
}
server-affidavit.model.ts
typescript
Copy code
export interface ServerAffidavit {
  affidavitType: string | null;
  affidavitName: string | null;
  notary: string | null;
  extraValue1: string | null;
  extraValue2: string | null;
  hardcodedDropdownValue: string | null;
  numericValue: number | null; // Add this field
}
Step 2: Update Component Template
Add the numeric input field to the form template.

affidavit-list.component.html
html
Copy code
<form (ngSubmit)="onSubmit()">
  <div>
    <h3>Affidavit Types</h3>
    <p-dropdown 
      [options]="affidavitTypes" 
      [(ngModel)]="selectedAffidavit.affidavitType" 
      name="affidavitType" 
      placeholder="Select a type" 
      required>
    </p-dropdown>
  </div>

  <div>
    <h3>Affidavit Names</h3>
    <p-dropdown 
      [options]="affidavitNames" 
      [(ngModel)]="selectedAffidavit.affidavitName" 
      name="affidavitName" 
      placeholder="Select a name" 
      required>
    </p-dropdown>
  </div>

  <div>
    <h3>Notaries</h3>
    <p-dropdown 
      [options]="notaries" 
      [(ngModel)]="selectedAffidavit.notary" 
      name="notary" 
      placeholder="Select a notary" 
      required>
    </p-dropdown>
  </div>

  <div>
    <h3>Extra Values</h3>
    <label for="extraField1">Extra Field 1:</label>
    <input pInputText id="extraField1" [(ngModel)]="extraValue1" name="extraField1">
    
    <label for="extraField2">Extra Field 2:</label>
    <input pInputText id="extraField2" [(ngModel)]="extraValue2" name="extraField2">
  </div>

  <div>
    <h3>Hardcoded Dropdown</h3>
    <p-dropdown 
      [options]="hardcodedOptions" 
      [(ngModel)]="hardcodedDropdownValue" 
      name="hardcodedDropdownValue" 
      placeholder="Select an option">
    </p-dropdown>
  </div>

  <div>
    <h3>Numeric Value</h3>
    <label for="numericValue">Numeric Value:</label>
    <input pInputText id="numericValue" [(ngModel)]="numericValue" name="numericValue" type="number" required>
  </div>

  <button pButton type="submit" label="Submit"></button>
</form>
Step 3: Update Component Logic
Handle the new numeric field in the component logic.

affidavit-list.component.ts
typescript
Copy code
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Affidavit } from './affidavit.model';
import { ServerAffidavit } from './server-affidavit.model';
import { AffidavitService } from './affidavit.service';

@Component({
  selector: 'app-affidavit-list',
  templateUrl: './affidavit-list.component.html',
  styleUrls: ['./affidavit-list.component.css']
})
export class AffidavitListComponent implements OnInit {
  affidavitTypes: { label: string, value: string }[] = [];
  affidavitNames: { label: string, value: string }[] = [];
  notaries: { label: string, value: string }[] = [];
  hardcodedOptions: { label: string, value: string }[] = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' }
  ];
  selectedAffidavit: Affidavit = {
    affidavitType: null,
    affidavitName: null,
    notary: null
  };
  extraValue1: string = '';
  extraValue2: string = '';
  hardcodedDropdownValue: string | null = null;
  numericValue: number | null = null;

  private submitUrl = 'your-submit-url-here'; // Replace with your actual URL

  constructor(
    private http: HttpClient,
    private affidavitService: AffidavitService
  ) {}

  ngOnInit(): void {
    this.affidavitService.getAffidavits().subscribe((data: Affidavit[]) => {
      this.affidavitTypes = [...new Set(data.map(item => ({ label: item.affidavitType, value: item.affidavitType })))]
        .filter(type => type.label !== null);
      this.affidavitNames = [...new Set(data.map(item => ({ label: item.affidavitName, value: item.affidavitName })))]
        .filter(name => name.label !== null);
      this.notaries = [...new Set(data.map(item => ({ label: item.notary, value: item.notary })))]
        .filter(notary => notary.label !== null);
    });
  }

  onSubmit(): void {
    const serverAffidavit: ServerAffidavit = {
      affidavitType: this.selectedAffidavit.affidavitType,
      affidavitName: this.selectedAffidavit.affidavitName,
      notary: this.selectedAffidavit.notary,
      extraValue1: this.extraValue1,
      extraValue2: this.extraValue2,
      hardcodedDropdownValue: this.hardcodedDropdownValue,
      numericValue: this.numericValue
    };

    this.http.post(this.submitUrl, serverAffidavit).subscribe(response => {
      console.log('Form submitted successfully', response);
    });
  }
}
