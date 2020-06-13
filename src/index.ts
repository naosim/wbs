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
import { View } from './View'
import { Config } from './Config'
declare var window;

(() => {
  var issueRepository: IssueRepository;
  var commentRepository: CommentRepository;
  var config = window.config as Config
  
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
        new Date(),
        config
      );
        
    });
  })
})()


