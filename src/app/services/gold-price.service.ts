import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface GoldPriceRecord {
  id: number;
  type: string;
  goldType: string;
  buyPrice: number;
  sellPrice: number;
  currency: string;
  source: string;
  sourceUrl: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoldPriceGroup {
  goldType: string;
  records: GoldPriceRecord[];
}

@Injectable({
  providedIn: 'root'
})
export class GoldPriceService {
  private apiUrl = `${environment.apiBaseUrl}/gold-prices/latest`;
  private collectUrl = `${environment.apiBaseUrl}/gold-prices/collect`;

  constructor(private http: HttpClient) {}

  getLatestPrices(): Observable<GoldPriceGroup[]> {
    return this.http.get<GoldPriceGroup[]>(this.apiUrl);
  }

  collectLatestPrices(): Observable<any> {
    return this.http.post<any>(this.collectUrl, {});
  }
}
