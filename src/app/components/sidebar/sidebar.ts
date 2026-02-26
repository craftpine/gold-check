import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  navItems: NavItem[] = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'show_chart', label: 'Markets', route: '/markets' },
    { icon: 'history', label: 'History', route: '/history' },
    { icon: 'settings', label: 'Settings', route: '/settings' },
  ];

  user = {
    name: 'Alex Johnson',
    role: 'Premium Member',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCemzHJ78gyKN44fFtC8Aufkd50SthT1yU56yIlx-XP2fX7b1mKrRsMzGnQNC1Bguz5IJIEhrO73ow_PLqukJEGvefxdbmrYcF1uWM0TFdKcjrNMz73jljIHAPW6s3nEQA-AKOT959lPvJjnzLe9K_Cr1SiSlvT_Y1X8U59sYYxV8YVY0pRrR4Mpv6fHNo1oKXgHHbOHymL3RWs6K1Du5xACG-Dx8SKUmnEAEsM1EY1ILCifgjZaK5v_2c5L4gkxMA7cw1vCwvqytHS'
  };
}
