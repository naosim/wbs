import { IssueRepository } from "../github/IssueRepository";

class TaskRootRepository {
  private taskRootText: string;
  constructor(taskRootIssueNumber: number, private issueRepository: IssueRepository) {
    this.taskRootText = issueRepository.getIssue(taskRootIssueNumber).body
  }
}