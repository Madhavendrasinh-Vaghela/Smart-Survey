import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Survey, SurveyDocument } from './survey.schema';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';

@Injectable()
export class SurveyService {
  constructor(
    @InjectModel(Survey.name) private surveyModel: Model<SurveyDocument>,
  ) {}

  // ─── CREATE ──────────────────────────────────────────
  async create(dto: CreateSurveyDto): Promise<Survey> {
    const survey = new this.surveyModel(dto);
    return survey.save();
  }

  // ─── GET ALL ─────────────────────────────────────────
  async findAll(): Promise<Survey[]> {
    return this.surveyModel.find().sort({ createdAt: -1 }).exec();
  }

  // ─── GET ACTIVE SURVEYS ONLY ─────────────────────────
  async findActive(): Promise<Survey[]> {
    return this.surveyModel
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .exec();
  }

  // ─── GET BY ID ───────────────────────────────────────
  async findById(id: string): Promise<Survey> {
    const survey = await this.surveyModel.findById(id).exec();
    if (!survey) throw new NotFoundException(`Survey with id ${id} not found`);
    return survey;
  }

  // ─── GET BY COMPANY ──────────────────────────────────
  async findByCompany(companyId: string): Promise<Survey[]> {
    return this.surveyModel
      .find({ companyId })
      .sort({ createdAt: -1 })
      .exec();
  }

  // ─── UPDATE ──────────────────────────────────────────
  async update(id: string, dto: UpdateSurveyDto): Promise<Survey> {
    const updated = await this.surveyModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException(`Survey with id ${id} not found`);
    return updated;
  }

  // ─── TOGGLE ACTIVE STATUS ────────────────────────────
  async toggleStatus(id: string): Promise<Survey> {
    const survey = await this.surveyModel.findById(id).exec();
    if (!survey) throw new NotFoundException(`Survey with id ${id} not found`);
    survey.isActive = !survey.isActive;
    return survey.save();
  }

  // ─── DELETE ──────────────────────────────────────────
  async delete(id: string): Promise<{ message: string }> {
    const deleted = await this.surveyModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`Survey with id ${id} not found`);
    return { message: `Survey ${id} deleted successfully` };
  }

  // ─── COUNT ───────────────────────────────────────────
  async count(): Promise<number> {
    return this.surveyModel.countDocuments().exec();
  }
}