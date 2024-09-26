
export interface rEmployee {
    EmployeeID: number; 
    EmployeeName: string;
    EmployeeCost: number;
    EmployeePosition: string;
  }
  
  export interface rModule {
    ModuleName: string;
    ModuleAddDate: Date;
    ModuleDueDate: Date;
    ModuleActive: boolean;
    Employees: rEmployee[];
  }
  
  export interface rProjects {
    ProjectName: string;
    ProjectStart: Date;
    ProjectEnd: Date;
    ProjectStatus: boolean;
    cost?: number;
    detail: any
  }
  
  export interface rEvents {
    EventTitle: string;
    EventDescript?: string;
    EventStartDate: Date;
    EventEndDate: Date;
    EmployeeID?: number;
  }
  