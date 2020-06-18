// このシステムでは、テキストをmarkdownのようなフォーマットで記述する
// このテキストと値オブジェクトとの変換クラスをここに実装する

import { DateInTask, Link, Links, Milestone, Milestones } from "../../domain/TaskSummary";

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
    return new Milestone(DateInTaskFactory.create(dateText, now), title, now);
  }
  static createMilestones(text: string, now: Date): Milestones {
    return new Milestones(text.split('\n').map(v => v.trim()).filter(v => v.length > 0).map(v => MilestoneFactory.create(v, now)));
  }
}

export class LinkFactory {
  static create(v: string): Link {
    if(v.indexOf('[') == -1) {
      return new Link(v, v, false);
    }
    v = v.slice(v.indexOf('[') + 1);
    var ary = v.split('](');
    var title = ary[0];
    var path = ary[1].slice(0, ary[1].length - 1);
    return new Link(title, path, path.indexOf('http') == 0);
  }
}

export class LinksFactory {
  static create(text: string) {
    var list = text.split('\n').map(v => v.trim()).filter(v => v.length > 0).map(v => v.indexOf('- ') == 0 ? v.slice(2) : v).map(v => LinkFactory.create(v))
    return new Links(list);
  }
}

export class ToMarkdown {
  forLink(link: Link): string {
    if(link.title == link.path) {
      return link.title;
    }

    return `[${link.title}](${link.path})`
  }
  forLinks(links: Links): string {
    return links.list.map(v => `- ${v.text}`).join('\n')
  }

  forDateInTask(dateInTask: DateInTask) {
    return dateInTask.text; // あんまり意味がないけど、今後のためにラップしておく
  }
}
