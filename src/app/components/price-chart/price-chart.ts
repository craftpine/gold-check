import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoldPriceService, GoldPriceGroup } from '../../services/gold-price.service';

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
export class PriceChart implements OnInit {
  timeRanges: TimeRange[] = [
    { label: '1D', value: '1d', active: true },
    { label: '1W', value: '1w', active: false },
    { label: '1M', value: '1m', active: false },
    { label: '1Y', value: '1y', active: false },
  ];

  currentPrice = '0';
  highPrice = '0';
  lowPrice = '0';
  chartPath = '';
  chartAreaPath = '';
  btmcGoldType = '';
  pricePoints: number[] = [];

  constructor(private goldPriceService: GoldPriceService) {}

  ngOnInit(): void {
    this.loadBTMCData();
  }

  loadBTMCData(): void {
    this.goldPriceService.getLatestPrices().subscribe({
      next: (data) => {
        // Filter for BTMC gold types
        const btmcGroups = data.filter(group => group.goldType.startsWith('BTMC_'));

        if (btmcGroups.length > 0) {
          // Use the first BTMC group
          const btmcGroup = btmcGroups[0];
          this.btmcGoldType = btmcGroup.goldType.replace('BTMC_', '').replace(/_/g, ' ');

          // Extract prices from records (most recent first)
          this.pricePoints = btmcGroup.records.map(record => record.buyPrice);

          if (this.pricePoints.length > 0) {
            this.currentPrice = this.formatPrice(this.pricePoints[0]);
            this.highPrice = this.formatPrice(Math.max(...this.pricePoints));
            this.lowPrice = this.formatPrice(Math.min(...this.pricePoints));

            // Generate chart paths
            this.generateChartPaths();
          }
        }
      },
      error: (err) => {
        console.error('Error loading BTMC data:', err);
      },
    });
  }

  generateChartPaths(): void {
    if (this.pricePoints.length < 2) return;

    const width = 800;
    const height = 400;
    const padding = 20;

    // Reverse to show oldest to newest (left to right)
    const prices = [...this.pricePoints].reverse();

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1; // Avoid division by zero

    // Generate points
    const points: { x: number; y: number }[] = prices.map((price, index) => {
      const x = (index / (prices.length - 1)) * width;
      const y = height - padding - ((price - minPrice) / priceRange) * (height - 2 * padding);
      return { x, y };
    });

    // Generate smooth curve using quadratic bezier curves
    let pathD = `M${points[0].x},${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const midX = (current.x + next.x) / 2;
      const midY = (current.y + next.y) / 2;

      if (i === 0) {
        pathD += ` L${midX},${midY}`;
      } else {
        pathD += ` Q${current.x},${current.y} ${midX},${midY}`;
      }
    }

    // Add the last point
    const lastPoint = points[points.length - 1];
    pathD += ` L${lastPoint.x},${lastPoint.y}`;

    this.chartPath = pathD;
    this.chartAreaPath = `${pathD} L${width},${height} L0,${height} Z`;
  }

  formatPrice(price: number): string {
    return price.toLocaleString('vi-VN');
  }

  selectTimeRange(selectedRange: TimeRange): void {
    this.timeRanges.forEach(range => {
      range.active = range.value === selectedRange.value;
    });
  }

  get lastPointX(): number {
    return this.pricePoints.length > 0 ? 800 : 800;
  }

  get lastPointY(): number {
    if (this.pricePoints.length === 0) return 60;

    const prices = [...this.pricePoints].reverse();
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;
    const lastPrice = prices[prices.length - 1];

    const padding = 20;
    return 400 - padding - ((lastPrice - minPrice) / priceRange) * (400 - 2 * padding);
  }
}
