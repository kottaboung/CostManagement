

export interface masterDataResponse {
    status: string,
    message: string,
    data: masterData[]
}

export interface masterData {
    ProjectId: number,
    ProjectName: string,
    ProjectStart: Date,
    ProjectEnd: Date,
    ProjectStatus: number,
    Modules: masterDataModule[]
    ProjectCost?: number;
    ProjectEmployee?: masterDataEmployee[]
}

export interface masterDataModule {
    ModuleId: number,
    ModuleName: string,
    ModuleAddDate: Date,
    ModuleDueDate: Date,
    ProjectId: number,
    Employees: masterDataEmployee[]
    Duration: number;
}

export interface masterDataEmployee {
    EmployeeId: number,
    EmployeeName: string,
    EmployeePosition: string,
    EmployeeCost: number
}