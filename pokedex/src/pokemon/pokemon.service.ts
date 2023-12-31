import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {
  private defaultLimit: number;
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    try {
      const pokemons = await this.pokemonModel
        .find()
        .limit(limit)
        .skip(offset)
        .sort({ no: 1 })
        .select('-__v');
      return pokemons;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Cannot list pokemons');
    }
  }

  async findOne(id: string) {
    let pokemon: Pokemon;

    if (!isNaN(+id)) {
      pokemon = await this.pokemonModel.findOne({ no: +id });
    }

    //MongoID
    if (!pokemon && isValidObjectId(id)) {
      pokemon = await this.pokemonModel.findOne({ _id: id });
    }

    //Name
    if (!pokemon)
      pokemon = await this.pokemonModel.findOne({
        name: id.toLowerCase().trim(),
      });

    if (!pokemon) throw new NotFoundException('Pokemon not found');

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon: Pokemon = await this.findOne(term);

    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    try {
      await pokemon.updateOne(updatePokemonDto);

      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel
      .deleteOne({ _id: id })
      .exec();

    if (deletedCount === 0) throw new NotFoundException('Pokemon not found');

    return true;
  }

  private handleError(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException('Pokemon already exists');
    }

    console.log(error);
    throw new InternalServerErrorException('Cannot update pokemon');
  }
}
