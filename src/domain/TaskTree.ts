import { IssueRepository } from "./github/IssueRepository";
import { TaskId } from "./TaskId";

export class TreeNode<T> {
  public package: T[] = [];
  constructor(readonly value: T, readonly children: TreeNode<T>[] = []) {}
  get hasChildren(): boolean {
    return this.children.length > 0;
  }
  get lastChild(): TreeNode<T> {
    if(!this.hasChildren) throw 'no children';
    return this.children[this.children.length - 1];
  }
  addChild(node: TreeNode<T>) {
    node.package = [...this.package, this.value]
    this.children.push(node);
  }
}

export class TaskTitleAndId {
  constructor(readonly title: string, readonly taskId?: TaskId) {}
}

function convertToTree(text): TreeNode<TaskTitleAndId> {
  var root = new TreeNode<TaskTitleAndId>(new TaskTitleAndId('_root'));
  var lastNodes: TreeNode<TaskTitleAndId>[] = [root];
  text.trim().split('\n').forEach((line: string) => {
    var nest = line.split('-')[0].length / 2 + 1;//1 origin
    var node = new TreeNode<TaskTitleAndId>(textToTaskTitleAndId(line.trim().slice(2)));
    lastNodes[nest] = node;
    lastNodes[nest - 1].addChild(node);
  });
  return root;
}

function textToTaskTitleAndId(text) {
  if(text.indexOf('[') != 0) {
    return new TaskTitleAndId(text);
  }
  var ary = text.split('/');
  var taskId = parseInt(ary[ary.length - 1].split(')')[0]) as TaskId;
  var title = text.split(']')[0].slice(1);
  return new TaskTitleAndId(title, taskId)
}


export class TaskTreeRepository {
  constructor(private taskRootIssueNumber: number, private issueRepository: IssueRepository) {
  }

  getTaskTree(): TreeNode<TaskTitleAndId> {
    var taskRootText = this.issueRepository.getIssue(this.taskRootIssueNumber).body
    return convertToTree(taskRootText);
  }
  getTaskRootBody() {
    return this.issueRepository.getIssue(this.taskRootIssueNumber).body
  }
  updateTaskRootBody(taskRootBody, cb:(err?)=>void) {
    this.issueRepository.updateBody(this.taskRootIssueNumber, taskRootBody, cb);
  }
  updateTaskTitleAndId(taskTitleAndId: TaskTitleAndId, cb:(err?)=>void) {
    var rootBody = this.getTaskRootBody().split(taskTitleAndId.title).join(`[${taskTitleAndId.title}](./${taskTitleAndId.taskId})`)
    this.updateTaskRootBody(rootBody, cb);
  }
}