/// <reference path="./sugar.d.ts" />
import {NodeTask, TaskIf} from './domain/task'
import {IssueRepository} from './domain/github/IssueRepository'
import {IssueRepositoryImpl} from './infra/github/IssueRepositoryImpl'
import {IssueRepositoryDummy} from './infra/github/IssueRepositoryDummy'
import {CommentRepository} from './domain/github/CommentRepository'
import {CommentRepositoryImpl} from './infra/github/CommentRepositoryImpl'
import {CommentRepositoryDummy} from './infra/github/CommentRepositoryDummy'
import { TaskSummaryRepository, TaskSummary, Milestones, Milestone } from './domain/TaskSummary'
import { TaskSummaryRepositoryImpl } from './infra/tasksummary/TaskSummaryImpl'
import { Notes, TaskNoteRepository } from './domain/TaskNote'
import { TaskNoteRepositoryImpl } from './infra/tasknote/TaskNoteRepositoryImpl'
import { TaskTreeRepository } from './domain/TaskTree'
import { TitleOnlyToMangedService } from './service/TitleOnlyToMangedService'
import { UpdateNoteBodyService } from './service/UpdateNoteBodyService'
import { CreateEmptyNoteService } from './service/CreateEmptyNoteService'
import { View } from './View'
export declare var Vue: any;
export declare var config: { 
  githubToken: string, 
  owner: string, 
  repo: string,
  taskRootIssueNumber: number ,
  isDevelop:boolean
}

export type EditingText = {
  milestones: string;
  isEditingMilestones: boolean;
  assign: string;
  isEditingAssign: boolean;
  goal: string;
  isEditingGoal: boolean;
  completeDateText: string,
  isEditingCompleteDateText: boolean,
  linksText: string,
  isEditingLinksText: boolean,
}

export class Services {
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
      View.setup(
        taskSummaryRepository, 
        taskNoteRepository, 
        taskTreeRepository,
        new Date());
    });
  })
})()


