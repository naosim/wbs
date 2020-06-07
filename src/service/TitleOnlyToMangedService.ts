import { TitleOnlyTask } from '../domain/task';
import { TaskSummaryRepository } from '../domain/TaskSummary';
import { TaskId } from '../domain/TaskId';
import { TaskTreeRepository, TaskTitleAndId } from '../domain/TaskTree';
export class TitleOnlyToMangedService {
  constructor(
    private taskSummaryRepository: TaskSummaryRepository, 
    private taskTreeRepository: TaskTreeRepository
  ) {}
  
  convert(titleOnlyTask: TitleOnlyTask, cb: (err?) => void) {
    var event = titleOnlyTask.toMangedTask();
    this.taskSummaryRepository.create(event, (err, issueNumber) => {
      if (err) {
        cb(err);
        return;
      }
      this.taskTreeRepository.updateTaskTitleAndId(new TaskTitleAndId(event.title, issueNumber as TaskId), cb);
    });
  }
}
