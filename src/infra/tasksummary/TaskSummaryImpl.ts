import { TaskSummary, DateInTask, Milestone, Milestones, CreateTaskSummaryEvent, TaskSummaryRepository } from "../../domain/TaskSummary";
import { IssueRepository } from "../../domain/github/IssueRepository";
export class DateInTaskFactory {
  static create(dateText: string, now: Date): DateInTask {
    var parts = dateText.split('/').map(v => parseInt(v));
    if(parts.length == 2) {// ex 6/23
      parts = [(parts[0] <= 3 ? now.getFullYear() + 1: now.getFullYear()), ...parts]
    }
    var date = new Date(parts.join('/'));
    return new DateInTask(dateText, date);
  }
}

export class MilestoneFactory {
  // パターン
  // 2020/1/1 タスク名
  // 2020/1/1　タスク名全角区切り
  // 1/1 タスク名
  // タスク名 ほげ
  // 1/末 タスク名
  static create(text: string, now: Date): Milestone {
    var splitKey = ' '
    if(text.indexOf(splitKey) == -1) {
      splitKey = '　';
      if(text.indexOf(splitKey) == -1) {
        // throw `マイルストーンがパースできない ${text}`
        var title = text;
        var isDone = ['done', '完了', '了'].some(key => title.indexOf(`[${key}]`) != -1);
        return new Milestone(new DateInTask('', new Date('2999/12/31')), title, isDone, now);
      }
    }
    var dateText = text.slice(0, text.indexOf(splitKey));
    var title = text.slice(text.indexOf(splitKey)).trim();
    var isDone = ['done', '完了', '了'].some(key => title.indexOf(`[${key}]`) != -1);
    return new Milestone(DateInTask.create(dateText, now), title, isDone, now);    
  }
  static createMilestones(text: string, now: Date): Milestones {
    return new Milestones(text.split('\n').map(v => v.trim()).filter(v => v.length > 0).map(v => MilestoneFactory.create(v, now)))
  }
}

export class TaskSummaryRepositoryImpl implements TaskSummaryRepository {
  constructor(private issueRepository: IssueRepository) {
}

  /**
   * issueをsummaryに変換
   * @param issue 
   */
  static convert(issue, now: Date): TaskSummary {
    // bodyをパース
    var obj = issue.body.split('### ').slice(1).map(v => {
      var first = v.split('\n')[0];
      var key = first.trim();
      if(first.indexOf(':') != -1) {
        key = first.split(':')[0].trim();
      }
      var value = v.slice(key.length + 1).trim();
      return {key: key, value: value}
    }).reduce((memo, v) => {
      memo[v.key] = v.value;
      return memo;
    }, {})

    // md形式のリンクリストをパース
    obj['リンク'] = obj['リンク'].split('\n').map(v => {
      if(v.indexOf('[') == -1) {
        return {title: v, path: v, isHttp: false};
      }
      v = v.slice(v.indexOf('[') + 1);
      var ary = v.split('](');
      var title = ary[0];
      var path = ary[1].slice(0, ary[1].length - 1);
      return {title: title, path: path, isHttp: path.indexOf('http') == 0};
    })

    obj.isDone = obj['完了'] && obj['完了'].trim().length > 0;

    obj.isBeforeStartDate = obj['開始日'] && new Date(obj['開始日']) && new Date(obj['開始日']).getTime() > now.getTime()

    obj.milestones = MilestoneFactory.createMilestones(obj['マイルストーン'], now)

    // issue番号
    obj.issueNumber = issue.number
    return obj;
  }

  getSummary(num: number, now: Date): TaskSummary {
    if(num <= 0) {
      throw '不正な番号'
    }
    // 担当,関係者,完了,DONEの定義,マイルストーン,開始日,終了日,内容,リンク
    var issue = this.issueRepository.getIssue(num);
    var s = TaskSummaryRepositoryImpl.convert(issue, now);
    return s;
  }

  create(event: CreateTaskSummaryEvent, cb: (err?, issueNumber?: number)=>void) {
    var body = `
### 担当: 
### 関係者: 
### DONEの定義: 
### マイルストーン: 
### 開始日: 
### 終了日: 
### 内容: 
### リンク:
`.trim();

    this.issueRepository.createIssue({title: event.title, body: body}, (err, obj) => {
      if(err) {
        cb(err);
        return;
      }
      cb(null, obj.number)
    })
  }

}