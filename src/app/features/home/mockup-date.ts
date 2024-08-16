
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
            { projectName: 'Project C', cost: 7000000 },
            { projectName: 'Project D', cost: 3000000 },
          ],
        },
        // ... more months
        {
          month: 'December',
          projects: [
            { projectName: 'Project E', cost: 12000000 },
            { projectName: 'Project F', cost: 4000000 },
          ],
        },
      ],
    },
    {
      year: 2023,
      details: [
        {
          month: 'January',
          projects: [
            { projectName: 'Project G', cost: 8000000 },
            { projectName: 'Project H', cost: 6000000 },
          ],
        },
        {
          month: 'April',
          projects: [
            { projectName: 'Project I', cost: 5000000 },
            { projectName: 'Project J', cost: 7000000 },
          ],
        },
        // ... more months
        {
          month: 'December',
          projects: [
            { projectName: 'Project K', cost: 11000000 },
            { projectName: 'Project L', cost: 3000000 },
          ],
        },
      ],
    },
    // ... more years if needed
  ];
  