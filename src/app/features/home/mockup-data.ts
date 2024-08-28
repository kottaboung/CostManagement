import { calculateTotalCost } from "./mockup-service";

export interface Employee {
  emName: string;
  emCost: number;
}

export interface Module {
  moduleName: string;
  addDate: Date;
  dueDate: Date;
  active: boolean;
  manday: number;
  employees: Employee[];
}

export interface Projects {
  name: string;
  createdDate: Date;
  status: 'inactive' | 'active' | 'done';
  modules: Module[];
  employees: Employee[];
  cost?: number;
}

export const mockProjects: Projects[] = [
  {
    name: 'Project Alpha',
    createdDate: new Date('2023-01-15'),
    status: 'active',
    modules: [
      {
        moduleName: 'Module 1',
        addDate: new Date('2023-02-01'),
        dueDate: new Date('2023-05-01'),
        active: true,
        manday: 30,
        employees: [
          { emName: 'Alice', emCost: 20000 },
          { emName: 'Bob', emCost: 15000 }
        ]
      },
      {
        moduleName: 'Module 2',
        addDate: new Date('2023-03-01'),
        dueDate: new Date('2023-06-01'),
        active: false,
        manday: 45,
        employees: [
          { emName: 'Charlie', emCost: 30000 }
        ]
      }
    ],
    employees: [
      { emName: 'Alice', emCost: 20000 },
      { emName: 'Bob', emCost: 15000 },
      { emName: 'Charlie', emCost: 30000 }
    ],
    cost: 0,
  },
  {
    name: 'Project Tester',
    createdDate: new Date('2023-07-15'),
    status: 'done',
    modules: [
      {
        moduleName: 'Module A',
        addDate: new Date('2023-08-01'),
        dueDate: new Date('2023-12-01'),
        active: true,
        manday: 60,
        employees: [
          { emName: 'David', emCost: 40000 },
          { emName: 'Eva', emCost: 25000 }
        ]
      }
    ],
    employees: [
      { emName: 'David', emCost: 40000 },
      { emName: 'Eva', emCost: 25000 }
    ],
    cost: 0,
  },
  {
    name: 'Project Beta',
    createdDate: new Date('2024-03-22'),
    status: 'inactive',
    modules: [
      {
        moduleName: 'Module X',
        addDate: new Date('2024-04-01'),
        dueDate: new Date('2024-07-01'),
        active: true,
        manday: 20,
        employees: [
          { emName: 'Frank', emCost: 15000 }
        ]
      }
    ],
    employees: [
      { emName: 'Frank', emCost: 15000 }
    ],
    cost: 0,
  }
];

mockProjects.forEach(project => {
  project.cost = calculateTotalCost(project);
});