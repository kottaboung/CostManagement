import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid'; // import dayGridPlugin
import timeGridPlugin from '@fullcalendar/timegrid'; // import timeGridPlugin
import listPlugin from '@fullcalendar/list'; // import listPlugin

@Component({
  selector: 'app-callendar',
  templateUrl: './callendar.component.html',
  styleUrl: './callendar.component.scss'
})
export class CallendarComponent implements OnInit {

  constructor(private http: HttpClient) {}

  Options: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next,today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [
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
