import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, DateInput, EventInput } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid'; // import dayGridPlugin
import timeGridPlugin from '@fullcalendar/timegrid'; // import timeGridPlugin
import listPlugin from '@fullcalendar/list'; // import listPlugin
import interactionPlugin from '@fullcalendar/interaction'
import { Employee, Projects } from '../../../features/home/mockup-interface';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component({
  selector: 'app-callendar',
  templateUrl: './callendar.component.html',
  styleUrl: './callendar.component.scss'
})
export class CallendarComponent implements OnInit {

  @Input() projectName: string = '';
  @Input() employees: Employee[] = [];

  @ViewChild(FullCalendarComponent) calendarComponent!: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next,today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    events: [],
    selectable: true,
    editable: true,
    weekends: true,
    eventClick: this.handleEventClick.bind(this),
  };

  employeeEvents: { [key: number]: EventInput[] } = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (this.projectName) {
      this.loadEvents();
    }
  }

  loadEvents(): void {
    this.http.get<Projects[]>('/assets/mockdata/mockData.json').subscribe(data => {
      const project = data.find(p => p.name === this.projectName);
      if (project) {
        const events: EventInput[] = [];
        project.modules.forEach(module => {
          module.mockEvents.forEach(event => {
            events.push({
              title: event.title,
              start: event.date,
              extendedProps: {
                module: module.moduleName,
                descript: event.descript
              },
              id: event.title
            });
  
            if (event.employeeId) {
              if (!this.employeeEvents[event.employeeId]) {
                this.employeeEvents[event.employeeId] = [];
              }
              this.employeeEvents[event.employeeId].push({
                id: event.title,
                title: event.title,
                start: event.date,
                extendedProps: {
                  descript: event.descript
                }
              });
            }
          });
        });
  
        // Refresh calendar with new events
        this.calendarComponent.getApi().removeAllEvents();
        this.calendarComponent.getApi().addEventSource(events);
      } else {
        console.warn('Project not found: ', this.projectName);
      }
    }, error => {
      console.error('Error loading events: ', error);
    });
  }
  

  handleEventClick(arg: any): void {
    const descript = arg.event.extendedProps['descript'] || 'No description available';
    alert('Event clicked: ' + arg.event.title + '\nDescription: ' + descript);
  }

  scrollToEvent(eventId?: string): void {
    if (!eventId) {
      console.warn('Event ID is undefined');
      return;
    }
  
    const calendarApi = this.calendarComponent.getApi();
    const event = calendarApi.getEventById(eventId);
    
    if (event && event.start) {
      // Scroll to the event start date
      const startDate = event.start;
      const dateStr = startDate.toISOString().split('T')[0]; // yyyy-mm-dd
  
      calendarApi.gotoDate(dateStr);
    } else {
      console.warn('Event not found or start date is null');
    }
  }
  
  
}
