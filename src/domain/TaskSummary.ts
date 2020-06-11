import { TaskId } from "./TaskId";

export interface TaskSummaryIF {
  taskId: TaskId;
  issueNumber: number;
  isDone: boolean;
  isBeforeStartDate: boolean;
  isAfterEndDate: boolean;
  isInStartEnd: boolean;
  milestones: Milestones;
  assign: string;
  related: string;
  goal: string;
  startDate?: DateInTask;
  endDate?: DateInTask;
  completeDate?: DateInTask;
  description: string;
  links: {title: string, path: string, isHttp: boolean}[];
}

export class TaskSummary implements TaskSummaryIF {
  taskId: TaskId;
  issueNumber: number;
  isDone: boolean;
  isBeforeStartDate: boolean;
  isAfterEndDate: boolean;
  isInStartEnd: boolean;
  milestones: Milestones;
  assign: string;
  related: string;
  goal: string;
  startDate?: DateInTask;
  endDate?: DateInTask;
  completeDate?: DateInTask;
  description: string;
  links: {title: string, path: string, isHttp: boolean}[]
  constructor(org: TaskSummaryIF) {
    this.taskId = org.taskId;
    this.issueNumber = org.issueNumber;
    this.isDone = org.isDone;
    this.isBeforeStartDate = org.isBeforeStartDate;
    this.isAfterEndDate = org.isAfterEndDate;
    this.isInStartEnd = org.isInStartEnd;
    this.milestones = org.milestones;
    this.assign = org.assign;
    this.related = org.related;
    this.goal = org.goal;
    this.startDate = org.startDate;
    this.endDate = org.endDate;
    this.completeDate = org.completeDate;
    this.description = org.description;
    this.links = org.links;
  }

  updateMilestones(milestones: Milestones): TaskSummary {
    var result = new TaskSummary(this);
    result.milestones = milestones;
    return result;
  }
  updateAssign(assign: string): TaskSummary {
    var result = new TaskSummary(this);
    result.assign = assign;
    return result;
  }
  updateGoal(goal: string): TaskSummary {
    var result = new TaskSummary(this);
    result.goal = goal;
    return result;
  }


}

/*
### 担当: 
### 関係者: 
### DONEの定義: 
### マイルストーン: 
### 開始日: 
### 終了日: 
### 内容: 
### リンク:
*/

export class Milestone {
  readonly isDone: boolean;
  constructor(
    public dateInTask: DateInTask, 
    public title: string,
    private now: Date
  ) {
    this.isDone = ['done', '完了', '了', '済', '済み'].some(key => this.title.indexOf(`[${key}]`) != -1);
  }
  get dateText(): string {
    return this.dateInTask.text;
  }
  
  isWithin(pastDate: Date): boolean {
    if(this.isDone) {
      return false;
    }
    return this.dateInTask.isWithin(pastDate);
  }
  get isWithinOneWeek(): boolean {
    return this.isWithin(new Date(this.now.getTime() + 7 * 24 * 60 * 60 * 1000));
  }
  contains(text: string): boolean {
    return this.title.indexOf(text) != -1 || this.dateInTask.text.indexOf(text) != -1;
  }
}

export class Milestones {
  constructor(readonly list: Milestone[]) {
  }
  contains(text: string): boolean {
    return this.list.some(v => v.contains(text))
  }
}

export class DateInTask {
  readonly date: Date;
  constructor(public text: string, date: Date) {
    this.date = new Date(date.toLocaleDateString());
  }
  isWithin(pastDate: Date): boolean {
    return this.date.getTime() <= pastDate.getTime();
  }
  static create(dateText: string, now: Date): DateInTask {
    var parts = dateText.split('/').map(v => parseInt(v));
    if(parts.length == 2) {// ex 6/23
      parts = [(parts[0] <= 3 ? now.getFullYear() + 1: now.getFullYear()), ...parts]
    }
    var date = new Date(parts.join('/'));
    return new DateInTask(dateText, date);
  }
}

export interface TaskSummaryRepository {
  getSummary(num: TaskId, now: Date): TaskSummary;
  create(event: CreateTaskSummaryEvent, cb: (err?, issueNumber?: number)=>void)
  update(summary: TaskSummary, cb: (err?)=>void)
}
export class CreateTaskSummaryEvent {
  constructor(readonly title: string) {}
}