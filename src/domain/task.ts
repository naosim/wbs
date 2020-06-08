import { TaskSummary, CreateTaskSummaryEvent } from "./TaskSummary"
import { TaskId } from "./TaskId";
import { Note } from "./TaskNote";

export interface TaskIf {
  title: string;
  isNode: boolean;
  isTitleOnly: boolean;
  isManaged: boolean;
  nest: string;
}

export class NodeTask implements TaskIf {
  isNode: boolean = true;
  isTitleOnly: boolean = false;
  isManaged: boolean = false;
  status = 'opened';

  constructor(
    public title: string,
    public children: Array<NodeTask | TitleOnlyTask | ManagedTask>,
    public nest: string
  ) {}
}

export class TitleOnlyTask implements TaskIf {
  isNode: boolean = false;
  isTitleOnly: boolean = true;
  isManaged: boolean = false;

  constructor(
    public title: string,
    public nest: string
  ) {}
  toMangedTask(): CreateTaskSummaryEvent {
    return new CreateTaskSummaryEvent(this.title);
  }
}

export class ManagedTask implements TaskIf {
  readonly isNode: boolean = false;
  readonly isTitleOnly: boolean = false;
  readonly isManaged: boolean = true;

  readonly isDone: boolean;
  readonly isBeforeStartDate: boolean;
  readonly isAfterEndDate: boolean;
  readonly latestNoteText: string;
  constructor(
    readonly taskId: TaskId,
    readonly title: string,
    readonly summary: TaskSummary,
    readonly latestNote: Note | null,
    public nest: string
  ) {
    this.isDone = summary.isDone;
    this.isBeforeStartDate = summary.isBeforeStartDate;
    this.isAfterEndDate = summary.isAfterEndDate;
    this.latestNoteText = latestNote ? `${latestNote.date}\n${latestNote.body}` : ''
  }
}
