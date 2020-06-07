/// <reference path="./sugar.d.ts" />
import {NodeTask, TaskIf, TitleOnlyTask} from './domain/task'
import {IssueRepository} from './domain/github/IssueRepository'
import {IssueRepositoryImpl} from './infra/github/IssueRepositoryImpl'
import {IssueRepositoryDummy} from './infra/github/IssueRepositoryDummy'
import {CommentRepository} from './domain/github/CommentRepository'
import {CommentRepositoryImpl} from './infra/github/CommentRepositoryImpl'
import {CommentRepositoryDummy} from './infra/github/CommentRepositoryDummy'
import { TaskSummaryRepository, TaskSummary } from './domain/TaskSummary'
import { TaskSummaryRepositoryImpl } from './infra/tasksummary/TaskSummaryImpl'
import { TaskId } from './domain/TaskId'
import { Note, Notes, TaskNoteRepository } from './domain/TaskNote'
import { TaskNoteRepositoryImpl } from './infra/tasknote/TaskNoteRepositoryImpl'
import { TaskTreeRepository, TaskTitleAndId } from './domain/taskroot/TaskTree'
import { TaskListFactory } from './TaskListFactory'
declare var Vue: any;
declare var config: { 
  githubToken: string, 
  owner: string, 
  repo: string,
  taskRootIssueNumber: number ,
  isDevelop:boolean
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
  const taskNoteRepository: TaskNoteRepository = new TaskNoteRepositoryImpl(commentRepository);
  const taskTreeRepository: TaskTreeRepository = new TaskTreeRepository(config.taskRootIssueNumber, issueRepository)

  issueRepository.refresh((err) => {
    if(err) {
      alert(err);
      throw err;
    }
    commentRepository.refreshNewestUpdateComments(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), (err, obj) => {
      if(err) {
        alert(err);
        throw err;
      }
      setup(
        taskSummaryRepository, 
        taskNoteRepository, 
        taskTreeRepository,
        new Date());
    });
  })
})()


function setup(
  taskSummaryRepository: TaskSummaryRepository, 
  taskNoteRepository: TaskNoteRepository,
  taskTreeRepository: TaskTreeRepository,
  now: Date
  ) {
  var taskListFactory = new TaskListFactory(taskSummaryRepository, taskNoteRepository, taskTreeRepository, now);
  var tasks = taskListFactory.create()
  var callbackToReload = (err?) => {
    if(err) throw err;
    app.reload();
  }
  var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!',
      list: tasks,
      rootBody: taskTreeRepository.getTaskRootBody(),
      filter: '',
      owner: config.owner,
      repo: config.repo,
      issueUrlPrefix: `https://github.com/${config.owner}/${config.repo}/issues`
    },
    computed: {
      expandList: function() {
        var result = this.list;
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
        this.list = taskListFactory.create()
        this.rootBody = taskTreeRepository.getTaskRootBody()
      },
      onPressedRootBodyEdit: function() {
        taskTreeRepository.updateTaskRootBody(this.rootBody, callbackToReload)
      },
      br(text) {
        return text.split('\n').join('<br>')
      },
      createTask(titleOnlyTask: TitleOnlyTask) {
        var event = titleOnlyTask.toMangedTask();
        taskSummaryRepository.create(event, (err, issueNumber) => {
          if(err) {
            alert(err);
            throw err;
          }
          taskTreeRepository.updateTaskTitleAndId(new TaskTitleAndId(event.title, issueNumber as TaskId), callbackToReload)
        })
        
      },
      editNote(note: Note, selector) {
        var body = document.querySelector(selector).value;
        var event = note.updateBody(body);
        taskNoteRepository.update(event, callbackToReload)
      },
      createNote(taskId: TaskId) {
        var event = taskNoteRepository.getNotes(taskId).createEmptyNote(now);
        taskNoteRepository.createEmptyNote(event, callbackToReload)
      }
    }
  })
}

