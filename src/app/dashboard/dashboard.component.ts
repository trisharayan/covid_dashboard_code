import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../api.service';
import * as Highcharts from 'highcharts';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  constructor(private service: ApiService,private router: Router) { }
  @ViewChild('container', { static: true }) container: ElementRef

  count = {
    updated_at: "",
    deaths: "",
    confirmed: "",
    recovered: "",
    active: ""
  }
  worldcounttable: any;

  public options: any = {
    chart: {
      type: 'line'
    },
    title: {
      text: 'COVID-19 Count'
    },
    subtitle: {
      text: ''
    },
    xAxis: {
      categories: []
    },
    yAxis: {
      title: {
        text: 'Count'
      },
      resize: {
        enabled: true
      }
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true
        },
        enableMouseTracking: false
      }
    },
    series: [
    ]
  }


  ngOnInit() {
    this.getCovidCount()
    this.getWorldCount()

  }

  getCovidCount() {
    this.service.getTimelinedata().subscribe((data) => {
      data = data.data
      this.count["updated_at"] = data[0]["updated_at"]
      this.count["deaths"] = data[0]["deaths"]
      this.count["confirmed"] = data[0]["confirmed"]
      this.count["recovered"] = data[0]["recovered"]
      this.count["active"] = data[0]["active"]

      let xAxisData = []
      let Graphdata = [{
        name: 'Confirmed',
        data: []
      }, {
        name: 'Active',
        data: []
      },
      {
        name: 'Deaths',
        data: []
      },
      {
        name: 'Recovered',
        data: []
      }
      ]


      data = data.reverse();
      data.forEach(element => {
        xAxisData.push(element.date)
        Graphdata[0].data.push(element.confirmed)
        Graphdata[1].data.push(element.active)
        Graphdata[2].data.push(element.deaths)
        Graphdata[3].data.push(element.recovered)


      });

      this.options.xAxis.categories = xAxisData
      this.options.series = Graphdata


      Highcharts.chart(this.container.nativeElement, this.options);


    })

  }

  getWorldCount() {
    this.service.getWorldCount().subscribe((data) => {
      this.worldcounttable = data.data;
    })
  }


  getTimeLine() {


    this.service.getWorldCount().subscribe((data) => {
      this.worldcounttable = data.data;
    })


  }








}


