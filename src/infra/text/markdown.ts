// このシステムでは、テキストをmarkdownのようなフォーマットで記述する
// このテキストと値オブジェクトとの変換クラスをここに実装する

import { DateInTask } from "../../domain/TaskSummary";

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
