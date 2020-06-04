import {CommentRepository} from '../../domain/github/CommentRepository'
declare var GitHub: any;
// var gh = new GitHub({token: config.githubToken});
// const issue = gh.getIssues(config.owner, config.repo)
// var root = null;

// function createRoot(issueObject) {
//   return issueObject;
// }

// class ReefTask {
  
// }



export class CommentRepositoryDummy implements CommentRepository {
  private issueCommentsMap = {}
  constructor() {

  }

  getCommentsForIssue(issueNumber: number) {
    if(!this.issueCommentsMap[issueNumber]) {
      this.issueCommentsMap[issueNumber] = [{id: 0, body: '2020/1/1\n---\nあああ'}]
    }
    return this.issueCommentsMap[issueNumber];
  }
  refreshNewestUpdateComments(since: Date | null, callback: (err?, list?: any[]) => any) {
    setTimeout(() => callback(null, []), 300);
  }
  update(issueNumber: number, id: number, body: string, callback: (err?, obj?) => void) {
    this.issueCommentsMap[issueNumber][id].body = body;
    setTimeout(() => callback(null, this.issueCommentsMap[issueNumber][id]), 100);
  }
  create(issueNumber: number, body: string, callback: (err?, obj?) => void) {
    var id = this.issueCommentsMap[issueNumber].length;
    this.issueCommentsMap[issueNumber].push({id: id, body: body})
    setTimeout(() => callback(null, this.issueCommentsMap[issueNumber][this.issueCommentsMap[issueNumber].length - 1]), 100);
  }
}