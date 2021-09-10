import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { filter, repeatWhen, take } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'get-visa';
  i = 0;
  dateList: Array<string> = [];
  audio = new Audio('assets/purge.mp3');
  actualDate = Date.parse('2021-09-18');
  afterDate = Date.parse('2021-09-12');
  showInfo = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getDate().pipe(
      repeatWhen(obs => obs),
      filter((data: any) => {
        this.i++;

        var result: Array<string> = data;
        this.dateList.push(result.length == 0 ? 'None' : result[0]);

        var date = Date.parse(result[0]);
        if (date < this.actualDate && date > Date.now() && date > this.afterDate) {
          return true;
        }
        return false;
      }),
      take(1)
    ).subscribe((result: any) => {
      this.dateList = [this.dateList[this.dateList.length - 1]];
      this.audio.play();
      this.showInfo = true;
      console.log(result);
    });
  }

  getDate() {
    return this.http.get('https://agendamigracolbackend.emtelco.co/api/list_date_schedule/?nopaginate=true&city_id=tipi33&headquarters_id=tipi48&schedulecstm__level1=Cedula_Extranjeria');
  }

  stopSound() {
    this.audio.pause();
  }
}
