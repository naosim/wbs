/// <reference path="./sugar.d.ts" />
import {NodeTask, ManagedTask, TaskIf} from './domain/task'
import {IssueRepository} from './domain/github/IssueRepository'
import {IssueRepositoryImpl} from './infra/github/IssueRepositoryImpl'
import {IssueRepositoryDummy} from './infra/github/IssueRepositoryDummy'
import {CommentRepository} from './domain/github/CommentRepository'
import {CommentRepositoryImpl} from './infra/github/CommentRepositoryImpl'
import {CommentRepositoryDummy} from './infra/github/CommentRepositoryDummy'
import { TaskSummaryRepository, TaskSummary } from './domain/TaskSummary'
import { TaskSummaryRepositoryImpl } from './infra/tasksummary/TaskSummaryImpl'
import { TaskId } from './domain/TaskId'
declare var Vue: any;
declare var config: { 
  githubToken: string, 
  owner: string, 
  repo: string,
  taskRootIssueNumber: number ,
  isDevelop:boolean
}



class TaskNoteRepository {
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

  getNotes(issueNumber: number): {date: string, body: string}[] {
    if(issueNumber <= 0) {
      throw '不正な番号'
    }
    // 担当,関係者,完了,DONEの定義,マイルストーン,開始日,終了日,内容,リンク
    var notes = this.commentRepository.getCommentsForIssue(issueNumber)
      .map(v => TaskNoteRepository.convert(v.id, v.body))
      .filter(v => v)
      .sort((a, b) => {
        if(a.date == b.date) return 0;
        if(a.date > b.date) return -1;
        if(a.date < b.date) return 1;
      });// exclude null
    // return [{date: '2020/1/1', body: 'hoge'}];
    console.log(issueNumber);
    console.log(notes);
    return notes;
  }

  update(issueNumber: number, id: number, date: string, body: string, cb: (err)=>void) {
    var comment = `
${date}
---
${body}
        `.trim()
    this.commentRepository.update(issueNumber, id, comment, (err, obj) => {
      cb(err);
    })
  }

  createEmpyNote(issueNumber: number, date: string, cb: (err)=>void) {
    var comment = `
${date}
---
        `.trim()
    this.commentRepository.create(issueNumber, comment, (err, obj) => {
      cb(err);
    })
  }
}

(() => {
  var issueRepository: IssueRepository;
  var commentRepository: CommentRepository;
  
  issueRepository = new IssueRepositoryImpl(
    config.githubToken,
    config.owner,
    config.repo
  );
  commentRepository = new CommentRepositoryImpl(
    config.githubToken,
    config.owner,
    config.repo
  );
  if(config.isDevelop) {
    issueRepository = new IssueRepositoryDummy(config.taskRootIssueNumber);
    commentRepository = new CommentRepositoryDummy();
  }

  const taskSummaryRepository: TaskSummaryRepository = new TaskSummaryRepositoryImpl(issueRepository);
  const taskNoteRepository: TaskNoteRepository = new TaskNoteRepository(commentRepository);

  issueRepository.refresh((err) => {
    if(err) {
      alert(err);
      throw err;
    }
    var rootIssue = issueRepository.getIssue(config.taskRootIssueNumber);
    commentRepository.refreshNewestUpdateComments(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), (err, obj) => {
      if(err) {
        alert(err);
        throw err;
      }
      console.log(obj);
      setup(config.taskRootIssueNumber, rootIssue.body, taskSummaryRepository, taskNoteRepository, issueRepository, new Date());
    });
  })
})()

function getExpandList(list: Array<NodeTask | ManagedTask>) {
  var result = [];
  list.forEach(v => {
    result.push(v)
    if(v.isNode) {
      getExpandList((v as NodeTask).children).forEach(p => result.push(p))
    }
  });
  return result;
}

function findParent(obj: NodeTask, nest) {
  if(nest == 0) {
    return obj;
  }
  
  var lastTask = obj.children[obj.children.length - 1];
  if(!lastTask.isNode) throw 'データ不正'
  return findParent(lastTask as NodeTask, nest - 1)
}

type TaskViewModel = {
  title: string, 
  nest: string, 
  children: TaskViewModel[], 
  status: string, 
  issueNumber: number, 
  isTask: boolean, 
  isIssuedTask: boolean,
  summary: TaskSummary, 
  notes: {date: string, body: string}[], 
  latestNote: any, 
  latestNoteText: string,
  isDone: boolean,
  isBeforeStartDate: boolean

}
// function parse(text, taskSummaryRepository: TaskSummaryRepository, taskNoteRepository: TaskNoteRepository, now: Date) {
//   var rootObj = {title: '_root', children: [], status: 'opened', isTask: false, summary:null, notes: null, latestNote: null, latestNoteText: ''};
//   var lastObj = rootObj;
//   var parentObj = rootObj;
//   var lastNest = 0;
//   text.trim().split('\n').forEach(line => {
//     var nest = line.split('-')[0].length / 2
//     var title = line.slice(nest * 2 + 2).trim();
//     var issueNumber = -1;
//     if(title.indexOf('[') == 0) {
//       let ary = title.split('/');
//       issueNumber = parseInt(ary[ary.length - 1].split(')')[0]);
//       title = title.split(']')[0].slice(1);
//     }
//     var obj: TaskViewModel = {title: title, nest: `nest${nest}`, children: [], status: 'opened', issueNumber: issueNumber, isTask: true, isIssuedTask: false, summary:null, notes: null, latestNote: null, latestNoteText: '', isDone: false, isBeforeStartDate: false};
//     if(obj.issueNumber > 0) {
//       obj.isIssuedTask = true;
//       obj.summary = taskSummaryRepository.getSummary(obj.issueNumber, now);
//       obj.notes = taskNoteRepository.getNotes(obj.issueNumber)
//       obj.latestNote = obj.notes[0];
//       obj.latestNoteText = obj.notes.length > 0 ? `${obj.notes[0].date}\n${obj.notes[0].body}`.split('\n').join('<br>') : '';
//       obj.isDone = obj.summary.isDone
//       obj.isBeforeStartDate = obj.summary.isBeforeStartDate
//     }
//     // console.log(nest, line);
//     if(lastNest == nest) {
//     }
//     if(lastNest < nest) {
//       parentObj = lastObj;
//     }
//     if(lastNest > nest) {
//       parentObj = findParent(root, nest)
//     }
//     // console.log(parentObj);
//     parentObj.isTask = false;
//     parentObj.children.push(obj)
//     lastObj = obj;
//     lastNest = nest;
//   });
//   // console.log(rootObj.children);
//   return rootObj.children;
// }

function parse2(text, taskSummaryRepository: TaskSummaryRepository, taskNoteRepository: TaskNoteRepository, now: Date): Array<NodeTask | ManagedTask> {
  var rootNodeTask = new NodeTask('_root', [], '');//{title: '_root', children: [], status: 'opened', isTask: false, summary:null, notes: null, latestNote: null, latestNoteText: ''};
  var lastTask: TaskIf = rootNodeTask;
  var parentTask = rootNodeTask;
  var lastNest = 0;
  text.trim().split('\n').forEach(line => {
    var nest = line.split('-')[0].length / 2
    var title = line.slice(nest * 2 + 2).trim();
    var issueNumber = -1;
    if(title.indexOf('[') == 0) {
      let ary = title.split('/');
      issueNumber = parseInt(ary[ary.length - 1].split(')')[0]);
      title = title.split(']')[0].slice(1);
    }
    var obj: TaskViewModel = {title: title, nest: `nest${nest}`, children: [], status: 'opened', issueNumber: issueNumber, isTask: true, isIssuedTask: false, summary:null, notes: null, latestNote: null, latestNoteText: '', isDone: false, isBeforeStartDate: false};
    var task: NodeTask | ManagedTask;
    if(obj.issueNumber > 0) {// managedTask
      task = new ManagedTask(
        obj.issueNumber as TaskId,
        obj.title,
        taskSummaryRepository.getSummary(obj.issueNumber, now),
        taskNoteRepository.getNotes(obj.issueNumber)[0],
        obj.nest
      )
    } else {
      task = new NodeTask(obj.title, [], obj.nest);
    }
    // console.log(nest, line);
    if(lastNest == nest) {
    }
    if(lastNest < nest) {
      if(lastTask.isManaged) throw 'データ不正'; 
      parentTask = lastTask as NodeTask;
    }
    if(lastNest > nest) {
      parentTask = findParent(rootNodeTask, nest)
    }
    // console.log(parentObj);
    parentTask.addChildren(task);
    lastTask = task;
    lastNest = nest;
  });
  // console.log(rootObj.children);
  return rootNodeTask.children;
}

function setup(
  taskRootIssueNumber: number,
  rootBody, 
  taskSummaryRepository: TaskSummaryRepository, 
  taskNoteRepository: TaskNoteRepository,
  issueRepository: IssueRepository,
  now: Date
  ) {
  console.log('rootBody', rootBody)
  var tasks = parse2(rootBody, taskSummaryRepository, taskNoteRepository, now)
  console.log(tasks);
  var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!',
      list: tasks,
      rootBody: rootBody,
      filter: '',
      owner: config.owner,
      repo: config.repo,
      issueUrlPrefix: `https://github.com/${config.owner}/${config.repo}/issues`
    },
    computed: {
      expandList: function() {
        var result = getExpandList(this.list);
        result = result.map(v => {
          if(this.filter.trim().length == 0) {
            v.isHilight = false;
          }else if(v.title.indexOf(this.filter) != -1) {
            v.isHilight = true;
          }else if(v.summary) {
            if(v.summary['担当'].indexOf(this.filter) != -1) {
              v.isHilight = true;
            }
          }else {
            v.isHilight = false;
          }

          return v;
        })
        return result;
      }
    },
    methods: {
      reload: function(){
        this.list = parse2(this.rootBody, taskSummaryRepository, taskNoteRepository, now);
      },
      onPressedRootBodyEdit: function() {
        issueRepository.updateBody(taskRootIssueNumber, this.rootBody, (err, obj)=> this.reload())
      },
      br(text) {
        return text.split('\n').join('<br>')
      },
      editComment(issueNumber, id, date: string,selector) {
        var body = document.querySelector(selector).value;
        console.log(issueNumber, id, document.querySelector(selector).value);
        taskNoteRepository.update(issueNumber, id, date, body, (err) => {
          if(err) {
            alert(err);
            throw err;
          }
          this.reload();
        })
      },
      createTask(nodeTask: NodeTask) {
        var event = nodeTask.toMangedTask()
        taskSummaryRepository.create(event, (err, issueNumber) => {
          if(err) {
            alert(err);
            throw err;
          }
          console.log(nodeTask);
          this.rootBody = this.rootBody.split(event.title).join(`[${event.title}](${this.issueUrlPrefix}/${issueNumber})`)
          this.onPressedRootBodyEdit();
        })
        
      },
      createNote(issueNumber) {
        var date = new Date();
        date.setDate(date.getDate() - date.getDay() + 1);// 月曜日
        var d = `${date.getFullYear()}/${zerofil(date.getMonth() + 1)}/${zerofil(date.getDate())}`
        console.log(d);
        taskNoteRepository.createEmpyNote(issueNumber, d, (err) => {
          if(err) {
            alert(err);
            throw err;
          }
          this.reload();
        })
      }
    }
  })
}
function zerofil(num) {
  return `0${num}`.slice(-2);
}

console.log(new Sugar.Date('2 weeks ago').getMonth());