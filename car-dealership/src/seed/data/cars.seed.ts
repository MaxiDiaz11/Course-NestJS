import { Car } from 'src/cars/interfaces/car.interface';
import { v4 as uuid } from 'uuid';

export const CARS_SEED: Car[] = [
  { id: uuid(), brand: 'Toyota', model: 'Yaris' },
  { id: uuid(), brand: 'BMW', model: 'X5' },
  { id: uuid(), brand: 'Tesla', model: 'Model 3' },
];
