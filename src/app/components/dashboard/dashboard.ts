import { Component } from '@angular/core';
import { SourceComparison } from '../source-comparison/source-comparison';
import { StatsCard } from '../stats-card/stats-card';
import { PriceChart } from '../price-chart/price-chart';

@Component({
  selector: 'app-dashboard',
  imports: [SourceComparison, PriceChart],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}
