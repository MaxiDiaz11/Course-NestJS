import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CarsService {
  private cars = [
    { id: 1, brand: 'Toyota', model: 'Yaris' },
    { id: 2, brand: 'BMW', model: 'X5' },
    { id: 3, brand: 'Tesla', model: 'Model 3' },
  ];

  getAllCars() {
    return this.cars;
  }

  getCarById(id: number) {
    const car = this.cars.find((car) => car.id === id);

    if (!car) throw new NotFoundException('Car not found');

    return car;
  }
}
