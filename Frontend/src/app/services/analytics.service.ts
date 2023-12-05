import { Injectable } from "@angular/core";
import { Observable, catchError, of, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environment/environment";
import { LoaderService } from "./loader.service";
import { SwalService } from "./swal.service";
import { MetricAnalytics, PeriodicAnalytics } from "../models/analytics.model";

@Injectable({
  providedIn: "root",
})
export class AnalyticsService {
  constructor(
    private httpClient: HttpClient,
    private loaderService: LoaderService,
    private swalService: SwalService
  ) {}

  apiUrl = environment.apiUrl;

  getMetricData(type = "seller"): Observable<any> {
    this.loaderService.show();

    return this.httpClient
      .get<MetricAnalytics>(this.apiUrl + `analysis/get-${type}-analytics`)
      .pipe(
        tap(() => {
          this.loaderService.hide();
        }),
        catchError((error) => {
          this.loaderService.hide();
          console.log(error);
          this.swalService.error(error.error?.message);
          return of(error);
        })
      );
  }

  getPeriodicData(type = "seller"): Observable<any> {
    this.loaderService.show();

    return this.httpClient
      .get<PeriodicAnalytics>(
        this.apiUrl + `analysis/get-${type}-periodic-analytics`
      )
      .pipe(
        tap(() => {
          this.loaderService.hide();
        }),
        catchError((error) => {
          this.loaderService.hide();
          console.log(error);
          this.swalService.error(error.error?.message);
          return of(error);
        })
      );
  }
}
