import { cars, baseCodes } from './db';

// Extract lightweight arrays for Edge Middleware validation
export const validMakes = cars.map(c => c.make);
export const validModels = cars.reduce((acc, car) => {
  acc[car.make] = car.models;
  return acc;
}, {} as Record<string, string[]>);
export const validCodes = Object.keys(baseCodes);
