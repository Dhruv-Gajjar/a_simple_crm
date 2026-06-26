import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteEntity } from './entities/note.entity';
import { NoteRepository } from './repositories/note.repository';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class NoteService {
  constructor(
    private noteRepository: NoteRepository,
    private logger: PinoLogger,
  ) {}

  async create(payload: CreateNoteDto): Promise<NoteEntity> {
    const newNote = await this.noteRepository.createAndSave(payload);

    if (!newNote) {
      this.logger.warn('Failed to create note.');
      throw new BadRequestException(`Failed to create note.`);
    }

    this.logger.info(
      { projectId: payload.projectId },
      `Created new note.`,
    );

    return newNote;
  }

  async findAll(): Promise<NoteEntity[]> {
    const notes = await this.noteRepository.findAll();

    if (!notes) {
      this.logger.warn('Failed to get all notes.');
      throw new BadRequestException(`Failed to get all notes`);
    }

    return notes;
  }

  async findOne(id: string): Promise<NoteEntity> {
    const note = await this.noteRepository.findOne({
      where: { id: id },
    });

    if (!note) {
      this.logger.warn({ id: id }, `Note with ID: ${id} not found.`);
      throw new NotFoundException(`Note with ID: ${id} not found.`);
    }

    return note;
  }

  async update(
    id: string,
    payload: UpdateNoteDto,
  ): Promise<NoteEntity> {
    const note = await this.noteRepository.update(id, payload);

    if (!note) {
      this.logger.warn(
        { id: id },
        `ERROR: updating note with ID: ${id}`,
      );
      throw new BadRequestException(`Failed to update note.`);
    }

    return note;
  }

  async remove(id: string): Promise<boolean> {
    const isDeleted = await this.noteRepository.deleteNote(id);

    if (!isDeleted) {
      this.logger.warn(
        { id: id },
        `ERROR: Deleting note with ID: ${id}`,
      );
      throw new BadRequestException(`Failed to delete note.`);
    }

    return isDeleted;
  }
}
