
import { Module, Projects } from './mockup-data';

function calculateMandays(module: Module): number {
  const startDate = new Date(module.addDate);
  const dueDate = new Date(module.dueDate);
  const diffTime = Math.abs(dueDate.getTime() - startDate.getTime());
  const mandays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return mandays;
}

export function calculateTotalCost(project: Projects): number {
  const moduleCosts = project.modules.reduce((total, module) => {
    const mandays = calculateMandays(module);
    const employeeCost = module.employees.reduce((moduleTotal, employee) => moduleTotal + employee.emCost, 0);
    return total + (employeeCost * mandays); 
  }, 0);

  const employeeCosts = project.employees ? project.employees.reduce((total, employee) => total + employee.emCost, 0) : 0;

  return moduleCosts + employeeCosts;
}
