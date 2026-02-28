import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoldPriceService } from '../../services/gold-price.service';
import { ToastService } from '../../services/toast.service';

interface GoldSource {
  name: string;
  buy: string;
  sell: string;
  change: number;
  changeLabel: string;
  isPositive: boolean;
  groups: any[]; // Array of gold type groups within this source
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
  collapsedStates: Map<string, boolean> = new Map(); // Track collapsed state for each source

  constructor(
    private goldPriceService: GoldPriceService,
    private toastService: ToastService
  ) {}

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

          // Initialize collapsed state (start expanded)
          this.collapsedStates.set(sourcePrefix, false);

          return {
            name: sourcePrefix,
            buy: this.formatPrice(latest.buyPrice, latest.currency, sourcePrefix),
            sell: this.formatPrice(latest.sellPrice, latest.currency, sourcePrefix),
            change: changePercent,
            changeLabel: this.formatChangeLabel(changePercent),
            isPositive: changePercent >= 0,
            groups: groups, // Include all groups for this source
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

  formatSourceName(goldType: string): string {
    // Replace underscores with spaces (e.g., "SJC_Nữ_trang_99%" -> "SJC Nữ trang 99%")
    return goldType.replace(/_/g, ' ');
  }

  formatPrice(price: number, currency: string, source: string): string {
    // Check if price is undefined or null
    if (price === undefined || price === null) {
      return '0';
    }

    // For spot prices, use USD format
    if (source.toLowerCase() === 'spot') {
      return `$${price?.toFixed(2)}`;
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

  toggleCollapse(sourceName: string): void {
    const currentState = this.collapsedStates.get(sourceName) || false;
    this.collapsedStates.set(sourceName, !currentState);
  }

  isCollapsed(sourceName: string): boolean {
    return this.collapsedStates.get(sourceName) || false;
  }

  onCollectLatestPrices(): void {
    this.goldPriceService.collectLatestPrices().subscribe({
      next: (response) => {
        console.log('Collect API response:', response);
        this.toastService.success('Successfully collected latest gold prices!');
        // Reload the data after collecting
        this.loadGoldPrices();
      },
      error: (err) => {
        console.error('Error collecting gold prices:', err);
        this.toastService.error('Failed to collect latest gold prices. Please try again.');
      },
    });
  }

  onExportData(): void {
    console.log('Exporting data...');
  }
}
