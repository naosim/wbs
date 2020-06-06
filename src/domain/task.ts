import { TaskSummary, CreateTaskSummaryEvent } from "./TaskSummary"
import { TaskId } from "./TaskId";

export interface TaskIf {
  title: string;
  isNode: boolean;
  isTitleOnly: boolean;
  isManaged: boolean;
  nest: string;
}

// class Task implements TaskIf {
//   isNode: boolean;
//   isTitleOnly: boolean;
//   isManaged: boolean;
//   title: string;
//   private constructor(
//     public nest: string, 
//     private _node: NodeTask, 
//     private _titleOnly: TitleOnlyTask, 
//     private _managed: ManagedTask
//   ) {
//     var task: TaskIf;
//     if(_node) {
//       task = _node;
//     } else if(_titleOnly) {
//       task = _titleOnly;
//     } else if(_managed) {
//       task = _managed;
//     } else {
//       throw '不明なタスク'
//     }
//     this.title = task.title;
//     this.isNode = task.isNode;
//     this.isTitleOnly = task.isTitleOnly;
//     this.isManaged = task.isManaged;
//   }

//   addChild(task: Task) {
//     if(this.isManaged) {
//       throw 'mangedにchildは追加できません'
//     }
//     if(this.isTitleOnly) {
//       this._node = new NodeTask(this.title, [task.value]);
//       this.title = this._node.title;
//       this.isNode = this._node.isNode;
//       this.isTitleOnly = this._node.isTitleOnly;
//       this.isManaged = this._node.isManaged;
//       return 
//     }
//     if(this.isManaged) {
//       this.node.addChildren(task.value);
//     }
//   }

//   get node(): NodeTask {
//     if(!this.isNode) throw 'nodeでない'
//     return this._node;
//   }
//   get titleOnly(): TitleOnlyTask {
//     if(!this.isTitleOnly) throw 'titleonlyでない'
//     return this._titleOnly;
//   }
//   get managed(): ManagedTask {
//     if(!this.isManaged) throw 'managedでない'
//     return this._managed;
//   }
//   get value(): NodeTask | TitleOnlyTask | ManagedTask {
//     return this._node || this._titleOnly || this._managed
//   }

//   static createNode(node: NodeTask, nest: string):Task {
//     return new Task(nest, node, null, null)
//   }
//   static createTitleOnly(titleOnly: TitleOnlyTask, nest: string):Task {
//     return new Task(nest, null, titleOnly, null)
//   }
//   static createManaged(managed: ManagedTask, nest: string):Task {
//     return new Task(nest, null, null, managed)
//   }
// }

export class NodeTask implements TaskIf {
  isNode: boolean;
  isTitleOnly: boolean;
  isManaged: boolean = false;
  status = 'opened';

  constructor(
    public title: string,
    public children: Array<NodeTask | ManagedTask>,
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

  addChildren(children: NodeTask | ManagedTask) {
    this.children.push(children);
    this.isNode = true;
    this.isTitleOnly = false;
  }

  toMangedTask(): CreateTaskSummaryEvent {
    if(!this.isTitleOnly) {
      throw 'title onlyでない'
    }
    return new CreateTaskSummaryEvent(this.title);
  }
}

// export class TitleOnlyTask implements TaskIf {
//   isNode: boolean = false;
//   isTitleOnly: boolean = true;
//   isManaged: boolean = false;

//   constructor(
//     public title: string,
//     public nest: string
//   ) {}
// }
export class ManagedTask implements TaskIf {
  readonly isNode: boolean = false;
  readonly isTitleOnly: boolean = false;
  readonly isManaged: boolean = true;

  readonly isDone: boolean;
  readonly isBeforeStartDate: boolean;
  readonly latestNoteText: string;
  constructor(
    readonly taskId: TaskId,
    readonly title: string,
    readonly summary: TaskSummary,
    readonly latestNote: {date: string, body} | null,
    public nest: string
  ) {
    this.isDone = summary.isDone;
    this.isBeforeStartDate = summary.isBeforeStartDate;
    this.latestNoteText = latestNote ? `${latestNote.date}\n${latestNote.body}` : ''
  }
}
