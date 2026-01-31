import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { BenefitService } from './benefit.service'

@ApiTags('Benefits')
@Controller('benefits')
export class BenefitController {
  constructor(private readonly benefitService: BenefitService) {}

  @Get()
  findAll(
    @Query('q') q?: string,
    @Query('category') category?: string,
    @Query('region') region?: string,
    @Query('sort') sort?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number
  ) {
    return this.benefitService.findAll({ q, category, region, sort, page, pageSize })
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.benefitService.findOne(id)
  }
}
