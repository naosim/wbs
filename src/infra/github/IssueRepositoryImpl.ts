import {IssueRepository} from '../../domain/github/IssueRepository'
declare var GitHub: any;

export class IssueRepositoryImpl implements IssueRepository {
  private issueMap;// cache
  private gh: any;
  private issues: any;
  constructor(
    githubToken: string, 
    owner: string, 
    repo: string
  ) {
    this.gh = new GitHub({token: githubToken});
    this.issues = this.gh.getIssues(owner, repo)
  }
  refresh(cb: (err?, list?: Array<any>)=>void) {
    this.issues.listIssues({state: 'all'}, (error, list) => {
      if(error) {
        cb(error, null);
        return;
        // alert(error);
        // throw error;
      }
      this.issueMap = {};
      list.forEach(v => this.setIssue(v))
      console.log(list);
      return cb(null, list);
    });
  }

  private setIssue(issueObj) {
    this.issueMap[issueObj.number] = issueObj;
  }

  private cb(cb, err, obj) {
    if(err) {
      cb(err);
    }
    this.setIssue(obj);
    cb(null, obj);
  }

  getIssue(issueNumber: number): any {
    return this.issueMap[issueNumber];
  }

  updateTitle(issueNumber: number, title: string, callback: (err, obj) => any) {
    this.issues.editIssue(issueNumber, {title: title}, (err, obj) => this.cb(callback, err, obj)) 
  }

  updateBody(issueNumber: number, body: string, callback: (err, obj) => any) {
    this.issues.editIssue(issueNumber, {body: body}, (err, obj) => this.cb(callback, err, obj)) 
  }

  createIssue(issue: {title: string, body: string}, callback: (err, obj) => any) {
    this.issues.createIssue(issue, (err, obj) => this.cb(callback, err, obj));
  }
}