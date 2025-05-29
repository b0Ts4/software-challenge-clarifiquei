import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { EngineersService } from './engineers.service';
import { Engineer } from 'src/models/engineer.model';

@Controller('engineers')
export class EngineersController {
  constructor(private readonly engineersService: EngineersService) {}

  @Get()
  async findAll(): Promise<Engineer[]> {
    return this.engineersService.getAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Engineer | null> {
    return this.engineersService.getById(id);
  }

  @Post()
  async create(@Body() engineer: Engineer): Promise<Engineer> {
    return this.engineersService.create(engineer);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() engineer: Engineer,
  ): Promise<Engineer | null> {
    return this.engineersService.update(id, engineer);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.engineersService.delete(id);
  }
}
