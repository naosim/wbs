import { NodeTask, TitleOnlyTask, ManagedTask, ClosedManagedTask } from '../domain/task';
import { TaskSummaryRepository } from '../domain/TaskSummary';
import { TaskNoteRepository } from '../domain/TaskNote';
import { TreeNode, TaskTitleAndId, TaskTreeRepository } from '../domain/TaskTree';

export class TaskListFactory {
  constructor(private taskSummaryRepository: TaskSummaryRepository, private taskNoteRepository: TaskNoteRepository, private taskTreeRepository: TaskTreeRepository, private now: Date) { }
  create(): Array<NodeTask | TitleOnlyTask | ManagedTask> {
    var tree = this.taskTreeRepository.getTaskTree();
    return this.flat(this.treeNodeToTask(tree, -1)).slice(1);
  }
  private treeNodeToTask(node: TreeNode<TaskTitleAndId>, nestNum: number = 0): NodeTask | TitleOnlyTask | ManagedTask | ClosedManagedTask {
    var title = node.value.title;
    var nest = `nest${nestNum}`;
    if (node.value.taskId) { // managed
      if(this.taskSummaryRepository.hasSummary(node.value.taskId)) {
        return new ManagedTask(node.value.taskId, title, this.taskSummaryRepository.getSummary(node.value.taskId, this.now), this.taskNoteRepository.getNotes(node.value.taskId).latestNote, nest, node.package.map(v => v.title));
      }
      return new ClosedManagedTask(title, nest, node.package.map(v => v.title));
    }
    else if (node.hasChildren) {
      return new NodeTask(title, node.children.map(v => this.treeNodeToTask(v, nestNum + 1)), nest);
    }
    else {
      return new TitleOnlyTask(title, nest, node.package.map(v => v.title));
    }
  }
  private flat(task: NodeTask | TitleOnlyTask | ManagedTask, list: (NodeTask | TitleOnlyTask | ManagedTask | ClosedManagedTask)[] = []): Array<NodeTask | TitleOnlyTask | ManagedTask | null> {
    if(task.isClosed) {
      return;
    }
    list.push(task);
    if (task.isNode) {
      (task as NodeTask).children.forEach(v => this.flat(v, list));
    }
    return list;
  }
}
