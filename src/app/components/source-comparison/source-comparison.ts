import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoldPriceService } from '../../services/gold-price.service';

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
export class SourceComparison implements OnInit {
  sources: GoldSource[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private goldPriceService: GoldPriceService) {}

  ngOnInit(): void {
    this.loadGoldPrices();
  }

  loadGoldPrices(): void {
    this.isLoading = true;
    this.error = null;

    this.goldPriceService.getLatestPrices().subscribe({
      next: (data) => {
        console.log('API Response:', data);

        // Group data by source prefix (e.g., BTMC, PNJ, SJC)
        const groupedBySource = new Map<string, any[]>();

        data.forEach(group => {
          if (group.records && group.records.length > 0) {
            const sourcePrefix = this.extractSourcePrefix(group.goldType);
            if (!groupedBySource.has(sourcePrefix)) {
              groupedBySource.set(sourcePrefix, []);
            }
            groupedBySource.get(sourcePrefix)!.push(group);
          }
        });

        // Convert grouped data to sources array
        this.sources = Array.from(groupedBySource.entries()).map(([sourcePrefix, groups]) => {
          // Use the first group's latest record for this source
          const firstGroup = groups[0];
          const latest = firstGroup.records[0];
          const previous = firstGroup.records[1];

          // Calculate change percent
          let changePercent = 0;
          if (previous && previous.buyPrice > 0) {
            changePercent = ((latest.buyPrice - previous.buyPrice) / previous.buyPrice) * 100;
          }

          return {
            name: sourcePrefix,
            buy: this.formatPrice(latest.buyPrice, latest.currency, sourcePrefix),
            sell: this.formatPrice(latest.sellPrice, latest.currency, sourcePrefix),
            change: changePercent,
            changeLabel: this.formatChangeLabel(changePercent),
            isPositive: changePercent >= 0,
          };
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading gold prices:', err);
        this.error = 'Failed to load gold prices';
        this.isLoading = false;
      },
    });
  }

  private extractSourcePrefix(goldType: string): string {
    // Extract the source prefix (e.g., "BTMC_NHẪN_TRÒN_TRƠN" -> "BTMC")
    const firstUnderscore = goldType.indexOf('_');
    if (firstUnderscore > 0) {
      return goldType.substring(0, firstUnderscore);
    }
    return goldType;
  }

  private formatSourceName(goldType: string): string {
    // Replace underscores with spaces (e.g., "SJC_Nữ_trang_99%" -> "SJC Nữ trang 99%")
    return goldType.replace(/_/g, ' ');
  }

  private formatPrice(price: number, currency: string, source: string): string {
    // Check if price is undefined or null
    if (price === undefined || price === null) {
      return '0';
    }

    // For spot prices, use USD format
    if (source.toLowerCase() === 'spot') {
      return `$${price.toFixed(2)}`;
    }

    // For VND prices (non-spot), format with thousand separators
    if (currency === 'VND') {
      return price.toLocaleString('vi-VN');
    }

    // Default format
    return `$${price.toFixed(2)}`;
  }

  private formatChangeLabel(change: number): string {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  }

  onExportData(): void {
    console.log('Exporting data...');
  }
}
