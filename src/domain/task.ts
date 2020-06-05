import { TaskSummary } from "./TaskSummary"

export interface Task {
  title: string;
  isNode: boolean;
  isTitleOnly: boolean;
  isManaged: boolean;
  nest: string;
}

export class NodeTask implements Task {
  isNode: boolean;
  isTitleOnly: boolean;
  isManaged: boolean = false;
  status = 'opened';

  constructor(
    public title: string,
    public children: Array<NodeTask | TitleOnlyTask | ManagedTask>,
    public nest: string
  ) {
    if(children.length > 0) {
      this.isNode = true;
      this.isTitleOnly = false;
    } else {
      this.isNode = false;
      this.isTitleOnly = true;
    }
  }

  addChildren(children: NodeTask | TitleOnlyTask | ManagedTask) {
    this.children.push(children);
    this.isNode = true;
    this.isTitleOnly = false;
  }
}

export class TitleOnlyTask implements Task {
  isNode: boolean = false;
  isTitleOnly: boolean = true;
  isManaged: boolean = false;

  constructor(
    public title: string,
    public nest: string,
  ) {}
}
export class ManagedTask implements Task {
  readonly isNode: boolean = false;
  readonly isTitleOnly: boolean = false;
  readonly isManaged: boolean = true;

  readonly isDone: boolean;
  readonly isBeforeStartDate: boolean;
  readonly latestNoteText: string;
  constructor(
    readonly taskId: number,
    readonly title: string,
    readonly summary: TaskSummary,
    readonly nest: string,
    readonly latestNote: {date: string, body} | null
  ) {
    this.isDone = summary.isDone;
    this.isBeforeStartDate = summary.isBeforeStartDate;
    this.latestNoteText = latestNote ? `${latestNote.date}\n${latestNote.body}` : ''
  }
}