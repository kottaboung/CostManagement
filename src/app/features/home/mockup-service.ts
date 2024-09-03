
import { Projects } from './mockup-data';

export function calculateTotalCost(project: Projects): number {
  const moduleCosts = project.modules.reduce((total, module) => {
    return total + module.employees.reduce((moduleTotal, employee) => moduleTotal + employee.emCost, 0);
  }, 0);

  const employeeCosts = project.employees.reduce((total, employee) => total + employee.emCost, 0);

  return moduleCosts + employeeCosts;
}
