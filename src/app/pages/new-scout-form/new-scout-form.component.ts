import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdicbTG8Pd1BrxdF5xH4TY5s96emj7c_9rfG1pKGseJDgmweg/viewform';

@Component({
  selector: 'app-new-scout-form',
  imports: [],
  templateUrl: './new-scout-form.component.html',
  styleUrl: './new-scout-form.component.scss'
})
export class NewScoutFormComponent {

  readonly formUrl = FORM_URL;
  readonly embedUrl: SafeResourceUrl;

  constructor(sanitizer: DomSanitizer) {
    this.embedUrl = sanitizer.bypassSecurityTrustResourceUrl(`${FORM_URL}?embedded=true`);
  }
}
