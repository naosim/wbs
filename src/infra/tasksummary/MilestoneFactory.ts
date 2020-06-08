import { DateInTask, Milestone, Milestones } from "../../domain/TaskSummary";
export class MilestoneFactory {
  // パターン
  // 2020/1/1 タスク名
  // 2020/1/1　タスク名全角区切り
  // 1/1 タスク名
  // タスク名 ほげ
  // 1/末 タスク名
  static create(text: string, now: Date): Milestone {
    var splitKey = ' ';
    if (text.indexOf(splitKey) == -1) {
      splitKey = '　';
      if (text.indexOf(splitKey) == -1) {
        // throw `マイルストーンがパースできない ${text}`
        var title = text;
        return new Milestone(new DateInTask('', new Date('2999/12/31')), title, now);
      }
    }
    var dateText = text.slice(0, text.indexOf(splitKey));
    var title = text.slice(text.indexOf(splitKey)).trim();
    return new Milestone(DateInTask.create(dateText, now), title, now);
  }
  static createMilestones(text: string, now: Date): Milestones {
    return new Milestones(text.split('\n').map(v => v.trim()).filter(v => v.length > 0).map(v => MilestoneFactory.create(v, now)));
  }
}
