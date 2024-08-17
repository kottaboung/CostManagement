
export interface Project {
    projectName: string;
    cost: number;
  }
  
  export interface MonthDetail {
    month: string;
    projects: Project[];
  }
  
  export interface YearDetail {
    year: number;
    details: MonthDetail[];
  }
  
  export const mockData = [
    {
      year: 2024,
      details: [
        {
          month: 'January',
          projects: [
            { projectName: 'Project A', cost: 10000000 },
            { projectName: 'Project B', cost: 5000000 },
          ],
        },
        {
          month: 'February',
          projects: [
           
          ],
        },
        {
          month: 'March',
          projects: []
        },
        {
          month: 'April',
          projects:[]
        },
        {
          month: 'May',
          projects:[]
        },
        {
          month: 'June',
          projects:[]
        },
        {
          month: 'July',
          projects:[]
        },
        {
          month: 'August',
          projects:[]
        },
        {
          month: 'September',
          projects:[]
        },
        {
          month: 'October',
          projects:[]
        },
        {
          month: 'November',
          projects:[]
        },
        {
          month: 'December',
          projects:[]
        },
        {
          month: 'December',
          projects: [
            
          ],
        },
      ],
    },
    
  ];
  