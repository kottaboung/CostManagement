import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core/index.js';

@Component({
  selector: 'app-callendar',
  templateUrl: './callendar.component.html',
  styleUrl: './callendar.component.scss'
})
export class CallendarComponent implements OnInit {

  constructor(private http: HttpClient) {}

  Options: CalendarOptions = {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next,today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [
      // { title: 'Event 1', date: '2024-09-01' },
      // { title: 'Event 2', date: '2024-09-02' }
    ],
    selectable: true,
    editable: true,
    eventClick: this.handleEventClick.bind(this)
  };
  
  ngOnInit(): void {
      this.loadEvent();
  }

  loadEvent(): void{
    this.http.get('../assets/mockdata/mockEvents.json').subscribe(
      (events: any) => {
        this.Options.events = events
      }
    );
  }

  handleEventClick(arg: any) {
    alert('Event clicked: ' + arg.event.title);
  }

}
