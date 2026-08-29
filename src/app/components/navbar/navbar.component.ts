import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavItem } from '../../shared/models/navbar.model';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  
  mobileOpen = signal(false);
  activeDropdown = signal<string | null>(null);
  scrolled = signal(false);

  navItems: NavItem[] = [
    { label: 'Home', path: '/' },
    { label: 'Events', path: '/events' },
    { label: 'Fundraising', path: '/fundraising' },
    // { label: 'Gallery', path: '/gallery' },
    {
      label: 'Guides & Resources', path: '/scout-resources',
      children: [
        { label: 'New Scout Orientation', path: '/new-members' },
        { label: 'Scout Resources', path: '/scout-resources' },
        { label: 'Uniform Guide', path: '/uniform' },
        { label: 'Scout Rank Requirements', path: '/scout-ranks' },
        { label: 'Camping for Beginners', path: '/camping-beginners' },
        { label: 'Adult Roles', path: '/adult-roles' },
        { label: 'Volunteering', path: '/volunteers' },
        { label: 'Glossary', path: '/glossary' }
      ]
    },
    { label: 'About', path: '/about' },
  ];

  constructor() {

  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 16);
  }

  toggleMobile(): void {
    this.mobileOpen.update(v => !v);
    if (this.mobileOpen()) this.activeDropdown.set(null);
  }

  toggleDropdown(label: string): void {
    this.activeDropdown.update(v => v === label ? null : label);
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
    this.activeDropdown.set(null);
  }
}
