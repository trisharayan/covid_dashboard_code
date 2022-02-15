import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
//import * as Highcharts from 'highcharts';
import * as  Highcharts from 'highcharts/highmaps.js';
import MapModule from 'highcharts/modules/map';
import { ApiService } from '../api.service';

MapModule(Highcharts);

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {

  constructor(private service: ApiService) { }
  @ViewChild('usagraph', { static: true }) container: ElementRef

  count = {
    updated_at: "",
    deaths: "",
    confirmed: "",
    recovered: "",
    critical: ""
  }
  statecounttable: any = [];

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
    this.getCovidUSACount()
    this.getstatescount()
  }

  getCovidUSACount() {
    this.service.getCovidUSACount().subscribe((data) => {
      data = data.data

      this.count["updated_at"] = data.latest_data["updated_at"]
      this.count["deaths"] = data.latest_data["deaths"]
      this.count["confirmed"] = data.latest_data["confirmed"]
      this.count["recovered"] = data.latest_data["recovered"]
      this.count["critical"] = data.latest_data["critical"]



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


      data = data.timeline.reverse()
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
    });
  }

  getstatescount() {
    this.service.getUSAStatesCount().subscribe((data) => {



      for (var key in data) {
        let temp = {
          name: "",
          confirmed: "",
          deaths: "",
          today_confirmed: 0,
          today_deaths: 0
        }
        temp.name = key
        temp.confirmed = data[key][data[key].length - 1].confirmed
        temp.deaths = data[key][data[key].length - 1].deaths

        let num = data[key][data[key].length - 1].confirmed - data[key][data[key].length - 2].confirmed
        if (num < 0) {
          num = 0
        }
        temp.today_confirmed = num
        num = data[key][data[key].length - 1].deaths - data[key][data[key].length - 2].deaths
        if (num < 0) {
          num = 0
        }
        temp.today_deaths = num

        this.statecounttable.push(temp)

      }


    })
  }


}

