import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Car } from './interfaces/car.interface';
import { v4 as uuid } from 'uuid';
import { CreateCarDto, UpdateCarDto } from './dto';

@Injectable()
export class CarsService {
  private cars: Car[] = [];

  getAllCars() {
    return this.cars;
  }

  getCarById(id: string) {
    const car = this.cars.find((car) => car.id === id);

    if (!car) throw new NotFoundException('Car not found');

    return car;
  }

  createCar(createCarDto: CreateCarDto) {
    const newCar: Car = {
      id: uuid(),
      ...createCarDto,
    };

    this.cars.push(newCar);

    return newCar;
  }

  updateCar(id: string, updateCarDto: UpdateCarDto) {
    let car = this.getCarById(id);

    if (updateCarDto.id && updateCarDto.id !== id)
      throw new BadRequestException('Car not found');

    let updatedCar = {
      ...car,
      ...updateCarDto,
      id,
    };

    this.cars = this.cars.map((car) => (car.id === id ? updatedCar : car));

    return updatedCar;
  }

  deleteCar(id: string) {
    this.getCarById(id);

    this.cars = this.cars.filter((car) => car.id !== id);

    return { deleted: true };
  }

  fillCarsWithSeedData(cars: Car[]) {
    this.cars = cars;
  }
}
