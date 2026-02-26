import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TimeRange {
  label: string;
  value: string;
  active: boolean;
}

@Component({
  selector: 'app-price-chart',
  imports: [CommonModule],
  templateUrl: './price-chart.html',
  styleUrl: './price-chart.css',
})
export class PriceChart {
  timeRanges: TimeRange[] = [
    { label: '1D', value: '1d', active: true },
    { label: '1W', value: '1w', active: false },
    { label: '1M', value: '1m', active: false },
    { label: '1Y', value: '1y', active: false },
  ];

  currentPrice = '$2,345.60';
  highPrice = '$2,351.24';
  lowPrice = '$2,318.40';

  selectTimeRange(selectedRange: TimeRange): void {
    this.timeRanges.forEach(range => {
      range.active = range.value === selectedRange.value;
    });
  }
}
