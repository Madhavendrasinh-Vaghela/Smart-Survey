import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SurveyService } from './survey.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';

@Controller('surveys')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  // POST /surveys
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateSurveyDto) {
    return this.surveyService.create(body);
  }

  // GET /surveys
  @Get()
  findAll(@Query('companyId') companyId?: string) {
    if (companyId) {
      return this.surveyService.findByCompany(companyId);
    }
    return this.surveyService.findAll();
  }

  // GET /surveys/active
  @Get('active')
  findActive() {
    return this.surveyService.findActive();
  }

  // GET /surveys/count
  @Get('count')
  count() {
    return this.surveyService.count();
  }

  // GET /surveys/:id
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.surveyService.findById(id);
  }

  // PUT /surveys/:id
  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateSurveyDto) {
    return this.surveyService.update(id, body);
  }

  // PATCH /surveys/:id/toggle
  @Patch(':id/toggle')
  toggleStatus(@Param('id') id: string) {
    return this.surveyService.toggleStatus(id);
  }

  // DELETE /surveys/:id
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string) {
    return this.surveyService.delete(id);
  }
}