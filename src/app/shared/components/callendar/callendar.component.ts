import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid'; // import dayGridPlugin
import timeGridPlugin from '@fullcalendar/timegrid'; // import timeGridPlugin
import listPlugin from '@fullcalendar/list'; // import listPlugin
import interactionPlugin from '@fullcalendar/interaction'
import { mock } from '../../../core/type/mockData';

@Component({
  selector: 'app-callendar',
  templateUrl: './callendar.component.html',
  styleUrl: './callendar.component.scss'
})
export class CallendarComponent implements OnInit {

  @Input() mockData:string | mock ='mockEvents';

  constructor(private http: HttpClient) {}

  Options: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next,today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [
    ],
    selectable: true,
    editable: true,
    weekends:true,
    eventClick: this.handleEventClick.bind(this)
  };
  eventsPromise: Promise<EventInput[]> | undefined;
  
  ngOnInit(): void {
      this.loadEvent();
  }

  loadEvent(): void{
    if (this.mockData) {
      const url = `assets/mockdata/${this.mockData}.json`;
      this.http.get(url).subscribe(
        (events: any) => {
          this.Options.events = events;
        },
        error => {
          console.error('Error loading events:', error);
        }
      );
    } else {
      console.warn('No mockData provided!');
    }
  }

  handleEventClick(arg: any) {
    alert('Event clicked: ' + arg.event.title);
  }

}
