import { Note, TaskNoteRepository } from '../domain/TaskNote';

export class UpdateNoteBodyService {
  constructor(private taskNoteRepository: TaskNoteRepository) { }
  update(note: Note, body: string, cb: (err?) => void) {
    var event = note.updateBody(body);
    this.taskNoteRepository.update(event, cb);
  }
}
