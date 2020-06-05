export type TaskSummary = {
  issueNumber: number,
  isDone: boolean,
  isBeforeStartDate: boolean
}

export class DateInTask {
  constructor(public text: string, public date: Date) {}
  static create(dateText: string, now: Date): DateInTask {
    var parts = dateText.split('/').map(v => parseInt(v));
    if(parts.length == 2) {// ex 6/23
      parts = [(parts[0] <= 3 ? now.getFullYear() + 1: now.getFullYear()), ...parts]
    }
    var date = new Date(parts.join('/'));
    return new DateInTask(dateText, date);
  }
}

export class Milestone {
  constructor(public dateInTask: DateInTask, public title: string) {
  }
}

export interface TaskSummaryRepository {
  getSummary(num: number, now: Date): TaskSummary;
  create(title, cb: (err?, issueNumber?: number)=>void)
}