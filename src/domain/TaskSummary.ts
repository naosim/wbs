export type TaskSummary = {
  issueNumber: number,
  isDone: boolean,
  isBeforeStartDate: boolean,
  milestones: Milestones
}

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
}

export class Milestones {
  constructor(readonly list: Milestone[]) {
  }
}

export class DateInTask {
  constructor(public text: string, public date: Date) {}
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
  getSummary(num: number, now: Date): TaskSummary;
  create(event: CreateTaskSummaryEvent, cb: (err?, issueNumber?: number)=>void)
}
export class CreateTaskSummaryEvent {
  constructor(readonly title: string) {}
}