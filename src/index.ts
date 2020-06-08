/// <reference path="./sugar.d.ts" />
import {NodeTask, TaskIf, TitleOnlyTask} from './domain/task'
import {IssueRepository} from './domain/github/IssueRepository'
import {IssueRepositoryImpl} from './infra/github/IssueRepositoryImpl'
import {IssueRepositoryDummy} from './infra/github/IssueRepositoryDummy'
import {CommentRepository} from './domain/github/CommentRepository'
import {CommentRepositoryImpl} from './infra/github/CommentRepositoryImpl'
import {CommentRepositoryDummy} from './infra/github/CommentRepositoryDummy'
import { TaskSummaryRepository, TaskSummary, Milestones, Milestone, DateInTask } from './domain/TaskSummary'
import { TaskSummaryRepositoryImpl } from './infra/tasksummary/TaskSummaryImpl'
import { TaskId } from './domain/TaskId'
import { Note, Notes, TaskNoteRepository } from './domain/TaskNote'
import { TaskNoteRepositoryImpl } from './infra/tasknote/TaskNoteRepositoryImpl'
import { TaskTreeRepository } from './domain/TaskTree'
import { TaskListFactory } from './TaskListFactory'
import { TitleOnlyToMangedService } from './service/TitleOnlyToMangedService'
import { UpdateNoteBodyService } from './service/UpdateNoteBodyService'
import { CreateEmptyNoteService } from './service/CreateEmptyNoteService'
declare var Vue: any;
declare var config: { 
  githubToken: string, 
  owner: string, 
  repo: string,
  taskRootIssueNumber: number ,
  isDevelop:boolean
}

class Services {
  constructor(
    readonly titleOnlyToMangedService: TitleOnlyToMangedService,
    readonly updateNoteBodyService: UpdateNoteBodyService,
    readonly createEmptyNoteService: CreateEmptyNoteService
  ) {}
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
  var services = new Services(
    new TitleOnlyToMangedService(taskSummaryRepository, taskTreeRepository),
    new UpdateNoteBodyService(taskNoteRepository),
    new CreateEmptyNoteService(taskNoteRepository, now)
  )
  var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!',
      list: tasks,
      rootBody: taskTreeRepository.getTaskRootBody(),
      filter: '',
      owner: config.owner,
      repo: config.repo,
      issueUrlPrefix: `https://github.com/${config.owner}/${config.repo}/issues`,
      filterCheckbox: {
        'title': {label: '件名', checked: true},
        'assgin': {label: '担当', checked: true},
        'body': {label: '内容', checked: true},
        'milestone': {label: 'マイルストーン', checked: true},
        'latestnote': {label: '最新状況', checked: true}
      }
    },
    computed: {
      decoratedList: function() {
        var result = this.list;
        var filterTargetsForSummary = ['担当', '内容', 'マイルストーン'];

        var fitlerTargetMap = {
          'title': v => v.title.indexOf(this.filter) != -1,
          'assgin': v => v.isManaged && v.summary['担当'].indexOf(this.filter) != -1,
          'body': v => v.isManaged && v.summary['内容'].indexOf(this.filter) != -1,
          'milestone': v => v.isManaged && v.summary['マイルストーン'].indexOf(this.filter) != -1,
          'latestnote': v => v.isManaged && v.latestNoteText.indexOf(this.filter) != -1
        };
        
        result = result.map(v => {
          v.isHilight = false;
          if(this.filter.trim().length == 0) {
            v.isHilight = false;
          }else if(Object.keys(fitlerTargetMap).filter(key => this.filterCheckbox[key].checked).some(key => fitlerTargetMap[key](v))) {
            v.isHilight = true;
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
        services.titleOnlyToMangedService.convert(titleOnlyTask, callbackToReload)
      },
      editNote(note: Note, selector) {
        var body = document.querySelector(selector).value.trim()
        services.updateNoteBodyService.update(note, body, callbackToReload)
      },
      createNote(taskId: TaskId) {
        services.createEmptyNoteService.create(taskId, callbackToReload)
      },
      hoge(tasksummary) {
        console.log(tasksummary);
        // tasksummary.milestones = new Milestones([new Milestone(new DateInTask('2020/1/1', new Date('2020/1/1')), 'hoge', now)]);
        // taskSummaryRepository.update(tasksummary, callbackToReload)
      }
    }
  })

}

