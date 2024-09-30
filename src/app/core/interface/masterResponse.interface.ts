import { rEmployee, rModule, rProjects } from "./dataresponse.interface";

export interface master {
    ProjectID : number,
    ProjectName : string,
    ProjectStart : Date,
    ProjectEnd : Date,
    ProjectStatus : number,
    modules : rModule[],
    employees : rEmployee[],
    cost?:number
}

export interface MasterResponse
{
    data : master[],
}