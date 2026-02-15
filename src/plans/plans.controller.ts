import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { PlansService } from './plans.service';
import { CreatePlansDto } from './dto/create-plans.dto';
import { Plan } from './entities/plans.entity';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post('createPlan')
  create(@Body() createPlansDto: CreatePlansDto): Promise<{ message: string }> {
    return this.plansService.create(createPlansDto);
  }

  @Get('allPlans')
  findAll(): Promise<Plan[]> {
    return this.plansService.findAll();
  }

  @Get('plan/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Plan> {
    return this.plansService.findone(id);
  }
}
