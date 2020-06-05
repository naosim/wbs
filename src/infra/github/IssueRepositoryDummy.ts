import {IssueRepository} from '../../domain/github/IssueRepository'
export class IssueRepositoryDummy implements IssueRepository {
  private issueNumberSeq = 1000;
  private map = {};
  constructor(readonly taskRootIssueNumber: number) {

  }
  refresh(callback: (err?, list?: Array<any>)=>void) {
    setTimeout(() => callback(), 100);
  }
  getIssue(issueNumber: number): any {
    console.log(issueNumber)
    if(!this.map[issueNumber]) {
      if(issueNumber == this.taskRootIssueNumber) {
        this.map[issueNumber] = { body: text }
      } else if(issueNumber == 5) {
        this.map[issueNumber] = { body: body_5_done }
      } else if(issueNumber == 27) {
        this.map[issueNumber] = { body: body27 }
      } else {
        this.map[issueNumber] = { body: body26 };
      }
      
    }
    return this.map[issueNumber];
  }
  updateTitle(issueNumber: number, title: string, callback: (err?, obj?) => any) {

  }
  updateBody(issueNumber: number, body: string, callback: (err?, obj?) => any) {
    this.map[issueNumber].body = body;
    setTimeout(() => callback(null, this.map[issueNumber]), 100);
  }
  createIssue(issue: {title: string, body: string}, callback: (err?, obj?) => any) {
    this.issueNumberSeq++;
    this.map[this.issueNumberSeq] = {
      number: this.issueNumberSeq,
      title: issue.title,
      body: issue.body
    };
    setTimeout(() => callback(null, this.map[this.issueNumberSeq]), 100);
    
  }
}

var text = `
- 学業
  - 宿題
    - [5月分](/26)
    - 6月分
- 遊び
  - [日本旅行](/5)
  - [世界一周](/27)
`.trim()

var body26 = `
### 担当: すずき
### 関係者: さとう
### DONEの定義: 終わらす
### マイルストーン
2020/06/06 始まりの儀
6/9 終わりの儀
### 開始日: 2020/05/11
### 終了日: 2020/05/29
### 内容
5/28にやる
頑張る
### リンク:
- [yahoo](http://www.yahoo.co.jp)
`.trim();

var body27 = `
### 担当: すずき
### 関係者: さとう
### DONEの定義: いつか
### マイルストーン: 
### 開始日: 2021/05/11
### 終了日: 2021/05/29
### 内容
世界一周する
頑張る
### リンク:
`.trim();


var body_5_done = `
### 担当: たなか
### 関係者:
### DONEの定義: 行く
### マイルストーン: 
### 開始日: 2020/05/11
### 終了日: 2020/05/29
### 内容
全国一周
### リンク:
### 完了: 2020/05/29
`.trim();