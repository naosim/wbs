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



export class CommentRepositoryImpl implements CommentRepository {
  private issueCommentsMap = {};
  private gh: any;
  private issues: any;
  private repo: any;
  constructor(
    githubToken: string, 
    owner: string, 
    repo: string
  ) {
    this.gh = new GitHub({token: githubToken});
    this.issues = this.gh.getIssues(owner, repo)
    this.repo = this.gh.getRepo(owner, repo);
  }
  getCommentsForIssue(issueNumber: number) {
    if(!this.issueCommentsMap[issueNumber]) {
      return [];
    }
    return Object.values(this.issueCommentsMap[issueNumber]);
  }
  refreshNewestUpdateComments(since: Date | null, callback: (err?, list?: any) => any) {
    var loopCount = 0;
    var lastId = -1;
    var loop = (err, list) => {
      
      if(err) {
        callback(err);
        return;
      }
      loopCount++;
      console.log(loopCount);
      console.log(list);
      if(loopCount > 30) throw '無限'

      if(!list) {
        this.repo.listComments({sort: 'updated', direction: 'asc', since: since}, loop)
      } else if(list.length > 0) {
        this.updateCache(list);
        if(lastId != list[list.length - 1].id) {
          lastId = list[list.length - 1].id;
          this.repo.listComments({sort: 'updated', direction: 'asc', since: list[list.length - 1].updated_at}, loop)
        } else {
          callback(err, this.issueCommentsMap)
        }
        
      } else {
        callback(err, this.issueCommentsMap)
      }
    }
    loop(null, null);
  }
  create(issueNumber: number, body: string, callback: (err?, obj?) => void) {
    this.issues.createIssueComment(issueNumber, body, (err?, obj?) => {
      if(err) {
        callback(err);
        return;
      }
      this.issueCommentsMap[issueNumber][obj.id] = obj;
      callback(null, obj);
    })
  }
  update(issueNumber: number, id: number, body: string, callback: (err?, obj?) => void) {
    this.issues.editIssueComment(id, body, (err, obj) => {
      if(err) {
        callback(err);
        return;
      }
      this.issueCommentsMap[issueNumber][id] = obj;
      callback(null, obj);
    })
  }
  private updateCache(comments: any[]) {
    comments.forEach(c => {
      var issueNumber = CommentRepositoryImpl.getIssueNumber(c);
      if(!this.issueCommentsMap[issueNumber]) {
        this.issueCommentsMap[issueNumber] = {};
      }
      this.issueCommentsMap[issueNumber][c.id] = c;
    })
  }
  static getIssueNumber(comment) {
    var result = parseInt(comment.html_url.slice(comment.html_url.lastIndexOf('/') + 1).split('#')[0]);
    return result;
  }
}