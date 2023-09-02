import { Injectable, NotFoundException } from '@nestjs/common';
import { Car } from './interfaces/car.interface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CarsService {
  private cars: Car[] = [
    { id: uuid(), brand: 'Toyota', model: 'Yaris' },
    { id: uuid(), brand: 'BMW', model: 'X5' },
    { id: uuid(), brand: 'Tesla', model: 'Model 3' },
  ];

  getAllCars() {
    return this.cars;
  }

  getCarById(id: string) {
    const car = this.cars.find((car) => car.id === id);

    if (!car) throw new NotFoundException('Car not found');

    return car;
  }
}
