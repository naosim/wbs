import { TaskId } from '../domain/TaskId';
import { TaskNoteRepository } from '../domain/TaskNote';
export class CreateEmptyNoteService {
  constructor(
    private taskNoteRepository: TaskNoteRepository, 
    private now: Date
  ) { }
  
  create(taskId: TaskId, cb: (err?) => void) {
    var event = this.taskNoteRepository.getNotes(taskId).createEmptyNote(this.now);
    this.taskNoteRepository.createEmptyNote(event, cb);
  }
}
