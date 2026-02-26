import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface GoldSource {
  name: string;
  buy: string;
  sell: string;
  change: number;
  changeLabel: string;
  isPositive: boolean;
}

@Component({
  selector: 'app-source-comparison',
  imports: [CommonModule],
  templateUrl: './source-comparison.html',
  styleUrl: './source-comparison.css',
})
export class SourceComparison {
  sources: GoldSource[] = [
    {
      name: 'SJC',
      buy: '81.50M',
      sell: '83.50M',
      change: 0.45,
      changeLabel: '0.45%',
      isPositive: true,
    },
    {
      name: 'Doji',
      buy: '81.45M',
      sell: '83.45M',
      change: 0.38,
      changeLabel: '+0.38%',
      isPositive: true,
    },
    {
      name: 'PNJ',
      buy: '72.80M',
      sell: '74.60M',
      change: -0.12,
      changeLabel: '-0.12%',
      isPositive: false,
    },
    {
      name: 'BTMC',
      buy: '81.55M',
      sell: '83.45M',
      change: 0.51,
      changeLabel: '+0.51%',
      isPositive: true,
    },
    {
      name: 'World Spot',
      buy: '$2,345.6',
      sell: '$2,346.2',
      change: 1.25,
      changeLabel: '+1.25%',
      isPositive: true,
    },
  ];

  onExportData(): void {
    console.log('Exporting data...');
  }
}
