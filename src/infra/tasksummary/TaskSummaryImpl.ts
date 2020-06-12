import { TaskSummaryIF, TaskSummary, Links, CreateTaskSummaryEvent, TaskSummaryRepository } from "../../domain/TaskSummary";
import { IssueRepository } from "../../domain/github/IssueRepository";
import { TaskId } from "../../domain/TaskId";
import { MilestoneFactory } from "./MilestoneFactory";
import { DateInTaskFactory, LinksFactory } from "../text/markdown";
export class TaskSummaryRepositoryImpl implements TaskSummaryRepository {
  constructor(private issueRepository: IssueRepository) {
}

  /**
   * issueをsummaryに変換
   * @param issue 
   */
  static convert(issue, taskId: TaskId, now: Date): TaskSummary {
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
    // obj['リンク'] = obj['リンク'].split('\n').filter(v => v.length > 0).map(v => {
    //   if(v.indexOf('[') == -1) {
    //     return {title: v, path: v, isHttp: false};
    //   }
    //   v = v.slice(v.indexOf('[') + 1);
    //   var ary = v.split('](');
    //   var title = ary[0];
    //   var path = ary[1].slice(0, ary[1].length - 1);
    //   return {title: title, path: path, isHttp: path.indexOf('http') == 0};
    // })
    obj.links = LinksFactory.create(obj['リンク'])
    console.log(obj.links);

    obj.isDone = obj['完了'] && obj['完了'].trim().length > 0;

    obj.milestones = MilestoneFactory.createMilestones(obj['マイルストーン'], now)

    /*
    milestones: Milestones,
    assign: string,
    related: string,
    goal: string,
    startDate: DateInTask,
    endDate: DateInTask,
    description: string,
    links: []
    */
    
    obj.assign = obj['担当']
    obj.related = obj['関係者']
    obj.goal = obj['DONEの定義']
    obj.description = obj['内容']
    obj.startDate = obj['開始日'].length > 0 ? DateInTaskFactory.create(obj['開始日'], now) : null
    obj.endDate = obj['終了日'].length > 0 ? DateInTaskFactory.create(obj['終了日'], now) : null
    obj.completeDate = obj['完了'] && obj['完了'].length > 0 ? DateInTaskFactory.create(obj['完了'], now) : null
    // issue番号
    obj.issueNumber = issue.number || taskId;
    obj.taskId = issue.number || taskId;

    obj.isBeforeStartDate = obj.startDate && obj.startDate.date.getTime() >= now.getTime()
    obj.isAfterEndDate = obj.endDate && obj.endDate.date.getTime() < now.getTime()
    obj.isInStartEnd = !obj.isBeforeStartDate && !obj.isAfterEndDate;

    return new TaskSummary(obj as TaskSummaryIF);
  }

  getSummary(num: TaskId, now: Date): TaskSummary {
    if(num <= 0) {
      throw '不正な番号'
    }
    // 担当,関係者,完了,DONEの定義,マイルストーン,開始日,終了日,内容,リンク
    var issue = this.issueRepository.getIssue(num);
    var s = TaskSummaryRepositoryImpl.convert(issue, num, now);
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
### 完了:
`.trim();

    this.issueRepository.createIssue({title: event.title, body: body}, (err, obj) => {
      if(err) {
        cb(err);
        return;
      }
      cb(null, obj.number)
    })
  }

  update(summary: TaskSummary, cb: (err?)=>void) {
    var map = TaskSummaryRepositoryImpl.toMap(summary);
    var text = Object.keys(map).map(k => {
      var value = map[k];
      if(value && value.split('\n').length >= 2) {
        return `### ${k}\n${value}`
      } else if(value && value.indexOf('- ') == 0) {
        return `### ${k}\n${value}`
      }
      return `### ${k}: ${value}`;
    }).join('\n')
    console.log(text);
    this.issueRepository.updateBody(summary.taskId, text, cb);
  }

  static toMap(summary: TaskSummary) {
    return {
      '担当': summary.assign,
      '関係者': summary.related,
      'DONEの定義': summary.goal, 
      'マイルストーン': summary.milestones.list.map(v => `${v.dateText} ${v.title}`).join('\n'),
      '開始日': summary.startDate ? summary.startDate.text : '',
      '終了日': summary.endDate ? summary.endDate.text : '',
      '内容': summary.description,
      'リンク':summary.links.text,
      '完了': summary.completeDate ? summary.completeDate.text : ''
    };
  }
}