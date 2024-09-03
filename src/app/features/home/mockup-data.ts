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
  detail: any
}

// mockProjects.forEach(project => {
//   project.cost = calculateTotalCost(project);
// });