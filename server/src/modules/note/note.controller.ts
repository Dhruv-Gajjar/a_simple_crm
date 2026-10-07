import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteDto } from './dto/note.dto';
import { PinoLogger } from 'nestjs-pino';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NoteEntity } from './entities/note.entity';
import { WorkspaceGuard } from 'src/common/guards/workspace.guard';
import { CurrentWorkspaceId } from 'src/common/decorators/current-workspace.decorator';

@Controller('note')
export class NoteController {
  constructor(
    private readonly noteService: NoteService,
    private logger: PinoLogger,
  ) {}

  @Post()
  @UseGuards(WorkspaceGuard)
  @ApiOperation({ summary: 'Create a new note' })
  @ApiResponse({ status: 201, description: 'Note created successfully' })
  @ApiResponse({ status: 400, description: 'Failed to create note' })
  async create(
    @CurrentWorkspaceId() workspaceId: string,
    @Body() payload: CreateNoteDto,
  ): Promise<NoteDto> {
    const note = await this.noteService.create(workspaceId, payload);

    if (!note) {
      this.logger.warn(`Failed to create new note.`);
      throw new BadRequestException(
        `ERROR: Failed to create new note, try again.`,
      );
    }

    return new NoteDto({
      id: note.id,
      projectId: note.projectId,
      content: note.content,
    });
  }

  @Get()
  @UseGuards(WorkspaceGuard)
  @ApiOperation({ summary: 'Get all notes' })
  @ApiResponse({
    status: 200,
    description: 'All notes fetch successfully',
  })
  @ApiResponse({ status: 400, description: 'Failed to get all notes' })
  async findAll(@CurrentWorkspaceId() workspaceId: string): Promise<NoteDto[]> {
    const notes = await this.noteService.findAll(workspaceId);

    if (!notes) {
      this.logger.warn({ action: 'getAllNotes' }, 'Failed to fetch all notes.');
      throw new InternalServerErrorException(`ERROR: Failed to get all notes`);
    }

    return notes.map(
      (note: NoteEntity) =>
        new NoteDto({
          id: note.id,
          projectId: note.projectId,
          content: note.content,
        }),
    );
  }

  @Get(':id')
  @UseGuards(WorkspaceGuard)
  @ApiOperation({ summary: 'Get Note By ID' })
  @ApiResponse({ status: 200, description: 'Fetch note by ID' })
  @ApiResponse({
    status: 400,
    description: 'Failed to find note with id',
  })
  async findOne(
    @Param('id') id: string,
    @CurrentWorkspaceId() workspaceId: string,
  ): Promise<NoteDto> {
    const note = await this.noteService.findOne(id, workspaceId);

    if (!note) {
      this.logger.warn({ id: id }, `Failed to get note by ID`);
      throw new InternalServerErrorException(
        'ERROR: Failed to get note by id.',
      );
    }

    return new NoteDto({
      id: note.id,
      projectId: note.projectId,
      content: note.content,
    });
  }

  @Patch(':id')
  @UseGuards(WorkspaceGuard)
  @ApiOperation({ summary: 'Update note' })
  @ApiResponse({ status: 200, description: 'Note updated successfully' })
  @ApiResponse({ status: 400, description: 'Failed to update note' })
  async update(
    @Param('id') id: string,
    @CurrentWorkspaceId() workspaceId: string,
    @Body() payload: UpdateNoteDto,
  ): Promise<NoteDto> {
    const note = await this.noteService.update(id, workspaceId, payload);

    if (!note) {
      this.logger.warn({ id: id }, `Failed to update note.`);
      throw new InternalServerErrorException('ERROR: Failed to update note.');
    }

    return new NoteDto({
      id: note.id,
      projectId: note.projectId,
      content: note.content,
    });
  }

  @Delete(':id')
  @UseGuards(WorkspaceGuard)
  @ApiOperation({ summary: 'Delete note' })
  @ApiResponse({
    status: 200,
    description: 'Note deleted successfully',
  })
  @ApiResponse({ status: 400, description: 'Failed to delete note' })
  async remove(
    @Param('id') id: string,
    @CurrentWorkspaceId() workspaceId: string,
  ): Promise<boolean> {
    const isNoteDeleted = await this.noteService.remove(id, workspaceId);

    if (!isNoteDeleted) {
      this.logger.warn({ id: id }, `Failed to delete note.`);
      throw new InternalServerErrorException('ERROR: Failed to delete note.');
    }

    return isNoteDeleted;
  }
}
