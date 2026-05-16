import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ApodInterface } from '../interfaces/apod.interface';
import { NeoResponse } from '../interfaces/mars.interface';

@Injectable({ providedIn: 'root' })
export class NasaService {
  private apiKey = 'bDZzPTwkNHcqlm9NtnhptYp2Qh8D5GBUYoiJOIIw';  
  private baseUrl = 'https://api.nasa.gov';

  constructor(private http: HttpClient) {}

  getApod(date?: string): Promise<ApodInterface> {
    const params = date ? `&date=${date}` : '';
    return firstValueFrom(
      this.http.get<ApodInterface>(`${this.baseUrl}/planetary/apod?api_key=${this.apiKey}${params}`)
    );
  }

  getNeoFeed(startDate: string, endDate: string): Promise<NeoResponse> {
    return firstValueFrom(
      this.http.get<NeoResponse>(
        `${this.baseUrl}/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${this.apiKey}`
      )
    );
  }
}