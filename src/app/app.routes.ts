import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Dashboard } from './components/dashboard/dashboard';
import { Markets } from './pages/markets/markets';
import { History } from './pages/history/history';
import { Settings } from './pages/settings/settings';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'markets', component: Markets },
      { path: 'history', component: History },
      { path: 'settings', component: Settings },
    ],
  },
];
