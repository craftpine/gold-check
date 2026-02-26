import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-card',
  imports: [CommonModule],
  templateUrl: './stats-card.html',
  styleUrl: './stats-card.css',
})
export class StatsCard {
  @Input() icon: string = '';
  @Input() label: string = '';
  @Input() value: string = '';
  @Input() badge: string = '';
  @Input() badgeType: 'success' | 'neutral' = 'neutral';
}
