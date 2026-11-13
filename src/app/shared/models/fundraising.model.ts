export interface Fundraiser {
  id: string;
  name: string;
  icon: string;
  description: string;
  startDate: string;
  endDate: string;
  goal: number;
  currentTotal: number;
  reward: string;
  topFundraiser: string;
  /** Optional external page (column K). Opens in a new tab. */
  linkUrl: string;
  /** Optional button text for linkUrl (column L). Defaults to "Visit site". */
  linkLabel: string;
}
