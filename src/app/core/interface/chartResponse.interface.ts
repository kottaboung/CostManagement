export interface ChartData {
    year: string;
    chart: MonthlyData[];
  }
  
  export interface MonthlyData {
    month: string;
    detail: ProjectDetail[];
    total: string;
  }
  
  export interface ProjectDetail {
    ProjectName: string;
    Cost: string;
  }

  export interface YearlyData {
    year: string;
    chart: {
      month: string;
      detail: { ProjectName: string; Cost: string }[];
      total: string;
    }[];
  }