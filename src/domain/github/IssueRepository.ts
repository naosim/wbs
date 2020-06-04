export interface IssueRepository {
  refresh(callback: (err?, list?: Array<any>)=>void);
  getIssue(issueNumber: number): any;
  updateTitle(issueNumber: number, title: string, callback: (err?, obj?) => any);
  updateBody(issueNumber: number, body: string, callback: (err?, obj?) => any);
  createIssue(issue: {title: string, body: string}, callback: (err?, obj?) => any);
}