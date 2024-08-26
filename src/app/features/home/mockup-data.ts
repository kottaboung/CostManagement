
  export interface Projects {
    name: string;
    cost: number;
    createdDate: Date;
    status: 'inactive' | 'active' | 'done';
  }
  
  export const mockProjects: Projects[] = [
    {
      name: 'Project Alpha',
      cost: 500000,
      createdDate: new Date('2023-01-15'),
      status: 'active'
    },
    {
      name: 'Project Beta',
      cost: 300000,
      createdDate: new Date('2024-03-22'),
      status: 'inactive'
    },
    // {
    //   name: 'Project Gamma',
    //   cost: 750000,
    //   createdDate: new Date('2023-05-10'),
    //   status: 'done'
    // },
    // Add more projects as needed
  ];
  
  