export interface CommentRepository {
  getCommentsForIssue(issueNumber: number);
  refreshNewestUpdateComments(since: Date | null, callback: (err?, obj?: any[]) => any);
  update(issueNumber: number, id: number, body: string, callback: (err?, obj?) => void);
  create(issueNumber: number, body: string, callback: (err?, obj?) => void);
}