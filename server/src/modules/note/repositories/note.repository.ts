import { BaseRepository } from 'src/common/repositories/base.repository';
import { DataSource } from 'typeorm';
import { NoteEntity } from '../entities/note.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateNoteDto } from '../dto/update-note.dto';

@Injectable()
export class NoteRepository extends BaseRepository<NoteEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, NoteEntity);
  }

  async update(id: string, payload: UpdateNoteDto): Promise<NoteEntity> {
    const existingNote = await this.repository.findOne({
      where: { id: id },
    });

    if (!existingNote) {
      throw new NotFoundException(`Note with ID: ${id} not found.`);
    }

    const note = await this.repository.save(payload);

    if (!note) {
      throw new BadRequestException(`ERROR: updating the note with ID: ${id}`);
    }

    return note;
  }

  async deleteNote(id: string): Promise<boolean> {
    const existingNote = await this.repository.findOne({
      where: { id: id },
    });

    if (!existingNote) {
      throw new NotFoundException(`Note with ID: ${id} not found.!`);
    }

    const note = await this.repository.remove(existingNote);

    if (!note) {
      throw new BadRequestException(`Error deleting the note with ID: ${id}`);
    }

    return true;
  }
}
