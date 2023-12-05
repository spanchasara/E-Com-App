import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  MetricAnalytics,
  PeriodicAnalytics,
} from "src/app/models/analytics.model";
import { RupeeFormatPipe } from "src/app/rupee-format.pipe";
import { AnalyticsService } from "src/app/services/analytics.service";

@Component({
  selector: "app-analytics",
  templateUrl: "./analytics.component.html",
  styleUrls: ["./analytics.component.css"],
})
export class AnalyticsComponent implements OnInit {
  type = "seller";

  constructor(
    private route: ActivatedRoute,
    private analyticsService: AnalyticsService
  ) {}

  metricData!: MetricAnalytics;

  monthlySalesData: any;
  monthlyOrderAndQtyData: any;
  yearlySalesData: any;
  yearlyOrderAndQtyData: any;

  formatYAxisLabel(value: string): string {
    const rupeeFormattedValue = new RupeeFormatPipe().transform(Number(value));
    return rupeeFormattedValue;
  }

  setMonthlyData(totalAmounts: any, totalQtys: any, orders: any) {
    const xaxis = {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      title: {
        text: "Month",
      },
    };

    this.monthlyOrderAndQtyData = {
      series: [
        {
          name: "Total Units",
          data: totalQtys,
        },
        {
          name: "Total Orders",
          data: orders,
        },
      ],

      title: {
        text: "Monthly Analysis of Orders and Units",
        align: "left",
      },

      xaxis,
    };

    this.monthlySalesData = {
      series: [
        {
          name: "Total Sales",
          data: totalAmounts,
        },
      ],

      title: {
        text: "Monthly Analysis of Sales",
        align: "left",
      },

      xaxis,
      yaxis: {
        labels: {
          formatter: this.formatYAxisLabel.bind(this),
        },
      },
    };
  }

  setYearlyData(totalAmounts: any, totalQtys: any, orders: any) {
    const xaxis = {
      categories: [
        "2014",
        "2015",
        "2016",
        "2017",
        "2018",
        "2019",
        "2020",
        "2021",
        "2022",
        "2023",
      ],
      title: {
        text: "Last 10 Years",
      },
    };

    this.yearlyOrderAndQtyData = {
      series: [
        {
          name: "Total Units",
          data: totalQtys,
        },
        {
          name: "Total Orders",
          data: orders,
        },
      ],

      title: {
        text: "Yearly Analysis of Orders and Units",
        align: "left",
      },

      xaxis,
    };

    this.yearlySalesData = {
      series: [
        {
          name: "Total Sales",
          data: totalAmounts,
        },
      ],

      title: {
        text: "Yearly Analysis of Sales",
        align: "left",
      },

      xaxis,
      yaxis: {
        labels: {
          formatter: this.formatYAxisLabel.bind(this),
        },
      },
    };
  }

  ngOnInit() {
    this.type = this.route.snapshot.data["type"];

    let totalAmounts = Array(12).fill(0);
    let totalQtys = Array(12).fill(0);
    let orders = Array(12).fill(0);

    this.analyticsService.getMetricData(this.type).subscribe((data) => {
      this.metricData = data;
    });

    this.analyticsService
      .getPeriodicData(this.type)
      .subscribe((periodicData: PeriodicAnalytics) => {
        console.log(periodicData);

        periodicData.monthAnalysis.forEach((analysis) => {
          const index = analysis.month - 1;
          totalAmounts[index] = analysis.totalAmount;
          totalQtys[index] = analysis.totalQty;
          orders[index] = analysis.orderIds.length;
        });

        this.setMonthlyData(totalAmounts, totalQtys, orders);

        totalAmounts = Array(10).fill(0);
        totalQtys = Array(10).fill(0);
        orders = Array(10).fill(0);

        periodicData.yearAnalysis.forEach((analysis) => {
          const index = analysis.year - 2014;
          totalAmounts[index] = analysis.totalAmount;
          totalQtys[index] = analysis.totalQty;
          orders[index] = analysis.orderIds.length;
        });

        this.setYearlyData(totalAmounts, totalQtys, orders);
      });
  }
}
