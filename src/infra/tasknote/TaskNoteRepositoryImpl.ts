import { CommentRepository } from "../../domain/github/CommentRepository";
import { Note, Notes, TaskNoteRepository, UpdateNoteEvent, CreateEmptyNoteEvent } from "../../domain/TaskNote";
import { TaskId } from "../../domain/TaskId";

export class TaskNoteRepositoryImpl implements TaskNoteRepository {
  constructor(private commentRepository: CommentRepository) {

  }

  static convert(id, body): {id, date: string, body: string, commentBody: string} | null {
    if(body.indexOf('---') == -1) {
      return null;
    }
    return {
      id: id,
      date: body.slice(0, body.indexOf('---')).trim(),
      body: body.slice(body.indexOf('---') + '---'.length).trim(),
      commentBody: body
    };
  }
  static createCommentText(date: Date, body: string) {
    return `${date.toLocaleDateString()}\n---\n${body.trim()}`;
  }

  getNotes(taskId: TaskId): Notes {
    if(taskId <= 0) {
      throw '不正な番号'
    }
    // 担当,関係者,完了,DONEの定義,マイルストーン,開始日,終了日,内容,リンク
    var notes: Note[] = this.commentRepository.getCommentsForIssue(taskId)
      .map(v => TaskNoteRepositoryImpl.convert(v.id, v.body))
      .filter(v => v)
      .map(v => new Note(taskId, v.id, new Date(v.date), v.body))
      .sort((a, b) => {
        a = a.date.getTime();
        b = b.date.getTime();
        if(a == b) return 0;
        if(a > b) return -1;
        if(a < b) return 1;
      });// exclude null
    // return [{date: '2020/1/1', body: 'hoge'}];

    return new Notes(taskId, notes);
  }
  
  update(event: UpdateNoteEvent, cb: (err)=>void) {
    this.commentRepository.update(event.taskId, event.id, TaskNoteRepositoryImpl.createCommentText(event.date, event.body), (err, obj) => {
      cb(err);
    })
  }

  createEmptyNote(event: CreateEmptyNoteEvent, cb: (err)=>void) {
    this.commentRepository.create(event.taskId, TaskNoteRepositoryImpl.createCommentText(event.date, ''), (err, obj) => {
      cb(err);
    })
  }
}