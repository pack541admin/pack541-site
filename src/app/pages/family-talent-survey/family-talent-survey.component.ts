import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSe-kvIMHlqwaunbP9TAux2qyvDSe1a2Kb_6WLsJGnh2UxJH7w/viewform';

@Component({
  selector: 'app-family-talent-survey',
  imports: [],
  templateUrl: './family-talent-survey.component.html',
  styleUrl: './family-talent-survey.component.scss'
})
export class FamilyTalentSurveyComponent {

  readonly formUrl = FORM_URL;
  readonly embedUrl: SafeResourceUrl;

  constructor(sanitizer: DomSanitizer) {
    this.embedUrl = sanitizer.bypassSecurityTrustResourceUrl(`${FORM_URL}?embedded=true`);
  }
}
