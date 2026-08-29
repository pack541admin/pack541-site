import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface QuickLink {
  label: string;
  desc: string;
  path: string;
}

interface NextStep {
  label: string;
  url: string;
  internal?: boolean;
}

@Component({
  selector: 'app-new-members',
  imports: [RouterLink],
  templateUrl: './new-members.component.html',
  styleUrl: './new-members.component.scss'
})
export class NewMembersComponent {

  readonly orientationPdfUrl = 'https://drive.google.com/file/d/1tUxxMo1D_hJjKeefXDaLMk6GGxj4OVSt/view?usp=drive_link';

  timeCommitment = [
    '1 Pack Meeting per month (2nd or 3rd Wednesday, 6:30–7:30 PM at Hicks Canyon MPR)',
    '1–2 Den Meetings per month, usually at a local park',
    '2 weekend family campouts per year (fall & spring)',
    '3 pack events per year — Pack Olympics, Day of Service, and Pinewood Derby',
  ];

  quickLinks: QuickLink[] = [
    { label: 'Uniform Guide', desc: 'What to buy for your Scout\'s rank and where to get it.', path: '/uniform' },
    { label: 'Scout Rank Requirements', desc: 'Adventures and requirements for each rank, Lion through Arrow of Light.', path: '/scout-ranks' },
    { label: 'Camping for Beginners', desc: 'What to pack and expect on your first family campout.', path: '/camping-beginners' },
    { label: 'Adult Roles', desc: 'Leadership and committee positions that keep the pack running.', path: '/adult-roles' },
    { label: 'Volunteering', desc: 'Every family is asked to help in some way — see how you can pitch in.', path: '/volunteers' },
    { label: 'Glossary', desc: 'New to scouting terminology? Look up any unfamiliar terms.', path: '/glossary' },
  ];

  nextSteps: NextStep[] = [
    { label: 'Sign up your Scout on BeAScout', url: 'https://my.scouting.org/online-registration/7cee2fb8-7e2b-46db-ad73-1632d0aa7aa7/applicant-type' },
    { label: 'Fill out the New Scout Form', url: '/new-scout-form', internal: true },
    { label: 'Fill out the Family Talent Survey', url: '/family-talent-survey', internal: true },
    { label: 'Complete the BSA Medical A/B Form for you and your Scout', url: 'https://filestore.scouting.org/filestore/HealthSafety/pdf/680-001_AB.pdf' },
    { label: 'Purchase your Scout\'s uniform', url: '/uniform', internal: true },
    { label: 'Send your Venmo info to the Treasurer for pack dues', url: 'https://account.venmo.com/u/Pack-Treasurer-541' },
  ];
}
