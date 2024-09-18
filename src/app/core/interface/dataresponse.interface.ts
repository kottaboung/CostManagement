
export interface Employee {
    id: number; 
    emName: string;
    emCost: number;
    possition: string;
  }
  
  export interface Module {
    moduleName: string;
    addDate: Date;
    dueDate: Date;
    active: boolean;
    manday: number;
    mCost?: number;
    employees: Employee[];
    mockEvents: Events[];
  }
  
  export interface Projects {
    name: string;
    createdDate: Date;
    status: boolean;
    modules: Module[];
    employees: Employee[];
    cost?: number;
    detail: any
  }
  
  export interface Events {
    title: string;
    descript?: string;
    date: Date;
    employeeId?: number;
  }
  