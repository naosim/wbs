import { NodeTask, TitleOnlyTask, ManagedTask } from './domain/task';
import { TaskSummaryRepository } from './domain/TaskSummary';
import { TaskNoteRepository } from './domain/TaskNote';
import { TreeNode, TaskTitleAndId, TaskTreeRepository } from './domain/taskroot/TaskTree';

export class TaskListFactory {
  constructor(private taskSummaryRepository: TaskSummaryRepository, private taskNoteRepository: TaskNoteRepository, private taskTreeRepository: TaskTreeRepository, private now: Date) { }
  create(): Array<NodeTask | TitleOnlyTask | ManagedTask> {
    var tree = this.taskTreeRepository.getTaskTree();
    return this.flat(this.treeNodeToTask(tree, -1)).slice(1);
  }
  private treeNodeToTask(node: TreeNode<TaskTitleAndId>, nestNum: number = 0): NodeTask | TitleOnlyTask | ManagedTask {
    var title = node.value.title;
    var nest = `nest${nestNum}`;
    if (node.value.taskId) { // managed
      return new ManagedTask(node.value.taskId, title, this.taskSummaryRepository.getSummary(node.value.taskId, this.now), this.taskNoteRepository.getNotes(node.value.taskId).latestNote, nest);
    }
    else if (node.hasChildren) {
      return new NodeTask(title, node.children.map(v => this.treeNodeToTask(v, nestNum + 1)), nest);
    }
    else {
      return new TitleOnlyTask(title, nest);
    }
  }
  private flat(task: NodeTask | TitleOnlyTask | ManagedTask, list: (NodeTask | TitleOnlyTask | ManagedTask)[] = []): Array<NodeTask | TitleOnlyTask | ManagedTask> {
    list.push(task);
    if (task.isNode) {
      (task as NodeTask).children.forEach(v => this.flat(v, list));
    }
    return list;
  }
}
