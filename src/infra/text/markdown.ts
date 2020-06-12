// このシステムでは、テキストをmarkdownのようなフォーマットで記述する
// このテキストと値オブジェクトとの変換クラスをここに実装する

import { DateInTask, Link, Links } from "../../domain/TaskSummary";

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