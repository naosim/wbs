import { TaskId } from "./TaskId";

export class Note {
  constructor(readonly taskId: TaskId, readonly id: number, readonly date: Date, readonly body: string) {}
  updateBody(body: string): UpdateNoteEvent {
    return new UpdateNoteEvent(this.taskId, this.id, this.date, body);
  }
}
export class Notes {
  constructor(readonly taskId: TaskId, readonly list: Note[]) {}
  get latestNote(): Note | null {
    return this.list.length > 0 ? this.list[0] : null;
  }
  createEmptyNote(now: Date): CreateEmptyNoteEvent {
    var date = new Date(now);
    date.setDate(date.getDay() == 0 ? date.getDate() - 6 : date.getDate() - date.getDay() + 1);// 月曜日
    date = new Date(date.toDateString());
    if(this.latestNote && this.latestNote.date.getTime() == date.getTime()) {
      throw '既に最新のノートがある';
    }

    return new CreateEmptyNoteEvent(this.taskId, date);
  }
}

export interface TaskNoteRepository {
  getNotes(taskId: TaskId): Notes;
  update(event: UpdateNoteEvent, cb: (err)=>void)
  createEmptyNote(event: CreateEmptyNoteEvent, cb: (err)=>void);
}

export class UpdateNoteEvent {
  constructor(readonly taskId: TaskId, readonly id: number, readonly date: Date, readonly body: string) {}
}

export class CreateEmptyNoteEvent {
  constructor(readonly taskId: TaskId, readonly date: Date) {}
}
