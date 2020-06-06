// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"domain/TaskSummary.ts":[function(require,module,exports) {
"use strict";

var __spreadArrays = this && this.__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
    s += arguments[i].length;
  }

  for (var r = Array(s), k = 0, i = 0; i < il; i++) {
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
      r[k] = a[j];
    }
  }

  return r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateTaskSummaryEvent = exports.Milestone = exports.DateInTask = void 0;

var DateInTask =
/** @class */
function () {
  function DateInTask(text, date) {
    this.text = text;
    this.date = date;
  }

  DateInTask.create = function (dateText, now) {
    var parts = dateText.split('/').map(function (v) {
      return parseInt(v);
    });

    if (parts.length == 2) {
      // ex 6/23
      parts = __spreadArrays([parts[0] <= 3 ? now.getFullYear() + 1 : now.getFullYear()], parts);
    }

    var date = new Date(parts.join('/'));
    return new DateInTask(dateText, date);
  };

  return DateInTask;
}();

exports.DateInTask = DateInTask;

var Milestone =
/** @class */
function () {
  function Milestone(dateInTask, title) {
    this.dateInTask = dateInTask;
    this.title = title;
  }

  return Milestone;
}();

exports.Milestone = Milestone;

var CreateTaskSummaryEvent =
/** @class */
function () {
  function CreateTaskSummaryEvent(title) {
    this.title = title;
  }

  return CreateTaskSummaryEvent;
}();

exports.CreateTaskSummaryEvent = CreateTaskSummaryEvent;
},{}],"domain/task.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ManagedTask = exports.NodeTask = void 0;

var TaskSummary_1 = require("./TaskSummary"); // class Task implements TaskIf {
//   isNode: boolean;
//   isTitleOnly: boolean;
//   isManaged: boolean;
//   title: string;
//   private constructor(
//     public nest: string, 
//     private _node: NodeTask, 
//     private _titleOnly: TitleOnlyTask, 
//     private _managed: ManagedTask
//   ) {
//     var task: TaskIf;
//     if(_node) {
//       task = _node;
//     } else if(_titleOnly) {
//       task = _titleOnly;
//     } else if(_managed) {
//       task = _managed;
//     } else {
//       throw '不明なタスク'
//     }
//     this.title = task.title;
//     this.isNode = task.isNode;
//     this.isTitleOnly = task.isTitleOnly;
//     this.isManaged = task.isManaged;
//   }
//   addChild(task: Task) {
//     if(this.isManaged) {
//       throw 'mangedにchildは追加できません'
//     }
//     if(this.isTitleOnly) {
//       this._node = new NodeTask(this.title, [task.value]);
//       this.title = this._node.title;
//       this.isNode = this._node.isNode;
//       this.isTitleOnly = this._node.isTitleOnly;
//       this.isManaged = this._node.isManaged;
//       return 
//     }
//     if(this.isManaged) {
//       this.node.addChildren(task.value);
//     }
//   }
//   get node(): NodeTask {
//     if(!this.isNode) throw 'nodeでない'
//     return this._node;
//   }
//   get titleOnly(): TitleOnlyTask {
//     if(!this.isTitleOnly) throw 'titleonlyでない'
//     return this._titleOnly;
//   }
//   get managed(): ManagedTask {
//     if(!this.isManaged) throw 'managedでない'
//     return this._managed;
//   }
//   get value(): NodeTask | TitleOnlyTask | ManagedTask {
//     return this._node || this._titleOnly || this._managed
//   }
//   static createNode(node: NodeTask, nest: string):Task {
//     return new Task(nest, node, null, null)
//   }
//   static createTitleOnly(titleOnly: TitleOnlyTask, nest: string):Task {
//     return new Task(nest, null, titleOnly, null)
//   }
//   static createManaged(managed: ManagedTask, nest: string):Task {
//     return new Task(nest, null, null, managed)
//   }
// }


var NodeTask =
/** @class */
function () {
  function NodeTask(title, children, nest) {
    this.title = title;
    this.children = children;
    this.nest = nest;
    this.isManaged = false;
    this.status = 'opened';

    if (children.length > 0) {
      this.isNode = true;
      this.isTitleOnly = false;
    } else {
      this.isNode = false;
      this.isTitleOnly = true;
    }
  }

  NodeTask.prototype.addChildren = function (children) {
    this.children.push(children);
    this.isNode = true;
    this.isTitleOnly = false;
  };

  NodeTask.prototype.toMangedTask = function () {
    if (!this.isTitleOnly) {
      throw 'title onlyでない';
    }

    return new TaskSummary_1.CreateTaskSummaryEvent(this.title);
  };

  return NodeTask;
}();

exports.NodeTask = NodeTask; // export class TitleOnlyTask implements TaskIf {
//   isNode: boolean = false;
//   isTitleOnly: boolean = true;
//   isManaged: boolean = false;
//   constructor(
//     public title: string,
//     public nest: string
//   ) {}
// }

var ManagedTask =
/** @class */
function () {
  function ManagedTask(taskId, title, summary, latestNote, nest) {
    this.taskId = taskId;
    this.title = title;
    this.summary = summary;
    this.latestNote = latestNote;
    this.nest = nest;
    this.isNode = false;
    this.isTitleOnly = false;
    this.isManaged = true;
    this.isDone = summary.isDone;
    this.isBeforeStartDate = summary.isBeforeStartDate;
    this.latestNoteText = latestNote ? latestNote.date + "\n" + latestNote.body : '';
  }

  return ManagedTask;
}();

exports.ManagedTask = ManagedTask;
},{"./TaskSummary":"domain/TaskSummary.ts"}],"infra/github/IssueRepositoryImpl.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IssueRepositoryImpl = void 0;

var IssueRepositoryImpl =
/** @class */
function () {
  function IssueRepositoryImpl(githubToken, owner, repo) {
    this.gh = new GitHub({
      token: githubToken
    });
    this.issues = this.gh.getIssues(owner, repo);
  }

  IssueRepositoryImpl.prototype.refresh = function (cb) {
    var _this = this;

    this.issues.listIssues({
      state: 'all'
    }, function (error, list) {
      if (error) {
        cb(error, null);
        return; // alert(error);
        // throw error;
      }

      _this.issueMap = {};
      list.forEach(function (v) {
        return _this.setIssue(v);
      });
      console.log(list);
      return cb(null, list);
    });
  };

  IssueRepositoryImpl.prototype.setIssue = function (issueObj) {
    this.issueMap[issueObj.number] = issueObj;
  };

  IssueRepositoryImpl.prototype.cb = function (cb, err, obj) {
    if (err) {
      cb(err);
    }

    this.setIssue(obj);
    cb(null, obj);
  };

  IssueRepositoryImpl.prototype.getIssue = function (issueNumber) {
    return this.issueMap[issueNumber];
  };

  IssueRepositoryImpl.prototype.updateTitle = function (issueNumber, title, callback) {
    var _this = this;

    this.issues.editIssue(issueNumber, {
      title: title
    }, function (err, obj) {
      return _this.cb(callback, err, obj);
    });
  };

  IssueRepositoryImpl.prototype.updateBody = function (issueNumber, body, callback) {
    var _this = this;

    this.issues.editIssue(issueNumber, {
      body: body
    }, function (err, obj) {
      return _this.cb(callback, err, obj);
    });
  };

  IssueRepositoryImpl.prototype.createIssue = function (issue, callback) {
    var _this = this;

    this.issues.createIssue(issue, function (err, obj) {
      return _this.cb(callback, err, obj);
    });
  };

  return IssueRepositoryImpl;
}();

exports.IssueRepositoryImpl = IssueRepositoryImpl;
},{}],"infra/github/IssueRepositoryDummy.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IssueRepositoryDummy = void 0;

var IssueRepositoryDummy =
/** @class */
function () {
  function IssueRepositoryDummy(taskRootIssueNumber) {
    this.taskRootIssueNumber = taskRootIssueNumber;
    this.issueNumberSeq = 1000;
    this.map = {};
  }

  IssueRepositoryDummy.prototype.refresh = function (callback) {
    setTimeout(function () {
      return callback();
    }, 100);
  };

  IssueRepositoryDummy.prototype.getIssue = function (issueNumber) {
    console.log(issueNumber);

    if (!this.map[issueNumber]) {
      if (issueNumber == this.taskRootIssueNumber) {
        this.map[issueNumber] = {
          body: text
        };
      } else if (issueNumber == 5) {
        this.map[issueNumber] = {
          body: body_5_done
        };
      } else if (issueNumber == 27) {
        this.map[issueNumber] = {
          body: body27
        };
      } else {
        this.map[issueNumber] = {
          body: body26
        };
      }
    }

    return this.map[issueNumber];
  };

  IssueRepositoryDummy.prototype.updateTitle = function (issueNumber, title, callback) {};

  IssueRepositoryDummy.prototype.updateBody = function (issueNumber, body, callback) {
    var _this = this;

    this.map[issueNumber].body = body;
    setTimeout(function () {
      return callback(null, _this.map[issueNumber]);
    }, 100);
  };

  IssueRepositoryDummy.prototype.createIssue = function (issue, callback) {
    var _this = this;

    this.issueNumberSeq++;
    this.map[this.issueNumberSeq] = {
      number: this.issueNumberSeq,
      title: issue.title,
      body: issue.body
    };
    setTimeout(function () {
      return callback(null, _this.map[_this.issueNumberSeq]);
    }, 100);
  };

  return IssueRepositoryDummy;
}();

exports.IssueRepositoryDummy = IssueRepositoryDummy;
var text = "\n- \u5B66\u696D\n  - \u5BBF\u984C\n    - [5\u6708\u5206](/26)\n    - 6\u6708\u5206\n- \u904A\u3073\n  - [\u65E5\u672C\u65C5\u884C](/5)\n  - [\u4E16\u754C\u4E00\u5468](/27)\n".trim();
var body26 = "\n### \u62C5\u5F53: \u3059\u305A\u304D\n### \u95A2\u4FC2\u8005: \u3055\u3068\u3046\n### DONE\u306E\u5B9A\u7FA9: \u7D42\u308F\u3089\u3059\n### \u30DE\u30A4\u30EB\u30B9\u30C8\u30FC\u30F3\n2020/06/06 \u59CB\u307E\u308A\u306E\u5100\n6/9 \u7D42\u308F\u308A\u306E\u5100\n### \u958B\u59CB\u65E5: 2020/05/11\n### \u7D42\u4E86\u65E5: 2020/05/29\n### \u5185\u5BB9\n5/28\u306B\u3084\u308B\n\u9811\u5F35\u308B\n### \u30EA\u30F3\u30AF:\n- [yahoo](http://www.yahoo.co.jp)\n".trim();
var body27 = "\n### \u62C5\u5F53: \u3059\u305A\u304D\n### \u95A2\u4FC2\u8005: \u3055\u3068\u3046\n### DONE\u306E\u5B9A\u7FA9: \u3044\u3064\u304B\n### \u30DE\u30A4\u30EB\u30B9\u30C8\u30FC\u30F3: \n### \u958B\u59CB\u65E5: 2021/05/11\n### \u7D42\u4E86\u65E5: 2021/05/29\n### \u5185\u5BB9\n\u4E16\u754C\u4E00\u5468\u3059\u308B\n\u9811\u5F35\u308B\n### \u30EA\u30F3\u30AF:\n".trim();
var body_5_done = "\n### \u62C5\u5F53: \u305F\u306A\u304B\n### \u95A2\u4FC2\u8005:\n### DONE\u306E\u5B9A\u7FA9: \u884C\u304F\n### \u30DE\u30A4\u30EB\u30B9\u30C8\u30FC\u30F3: \n### \u958B\u59CB\u65E5: 2020/05/11\n### \u7D42\u4E86\u65E5: 2020/05/29\n### \u5185\u5BB9\n\u5168\u56FD\u4E00\u5468\n### \u30EA\u30F3\u30AF:\n### \u5B8C\u4E86: 2020/05/29\n".trim();
},{}],"infra/github/CommentRepositoryImpl.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CommentRepositoryImpl = void 0; // var gh = new GitHub({token: config.githubToken});
// const issue = gh.getIssues(config.owner, config.repo)
// var root = null;
// function createRoot(issueObject) {
//   return issueObject;
// }
// class ReefTask {
// }

var CommentRepositoryImpl =
/** @class */
function () {
  function CommentRepositoryImpl(githubToken, owner, repo) {
    this.issueCommentsMap = {};
    this.gh = new GitHub({
      token: githubToken
    });
    this.issues = this.gh.getIssues(owner, repo);
    this.repo = this.gh.getRepo(owner, repo);
  }

  CommentRepositoryImpl.prototype.getCommentsForIssue = function (issueNumber) {
    if (!this.issueCommentsMap[issueNumber]) {
      return [];
    }

    return Object.values(this.issueCommentsMap[issueNumber]);
  };

  CommentRepositoryImpl.prototype.refreshNewestUpdateComments = function (since, callback) {
    var _this = this;

    var loopCount = 0;
    var lastId = -1;

    var loop = function loop(err, list) {
      if (err) {
        callback(err);
        return;
      }

      loopCount++;
      console.log(loopCount);
      console.log(list);
      if (loopCount > 30) throw '無限';

      if (!list) {
        _this.repo.listComments({
          sort: 'updated',
          direction: 'asc',
          since: since
        }, loop);
      } else if (list.length > 0) {
        _this.updateCache(list);

        if (lastId != list[list.length - 1].id) {
          lastId = list[list.length - 1].id;

          _this.repo.listComments({
            sort: 'updated',
            direction: 'asc',
            since: list[list.length - 1].updated_at
          }, loop);
        } else {
          callback(err, _this.issueCommentsMap);
        }
      } else {
        callback(err, _this.issueCommentsMap);
      }
    };

    loop(null, null);
  };

  CommentRepositoryImpl.prototype.create = function (issueNumber, body, callback) {
    var _this = this;

    this.issues.createIssueComment(issueNumber, body, function (err, obj) {
      if (err) {
        callback(err);
        return;
      }

      _this.issueCommentsMap[issueNumber][obj.id] = obj;
      callback(null, obj);
    });
  };

  CommentRepositoryImpl.prototype.update = function (issueNumber, id, body, callback) {
    var _this = this;

    this.issues.editIssueComment(id, body, function (err, obj) {
      if (err) {
        callback(err);
        return;
      }

      _this.issueCommentsMap[issueNumber][id] = obj;
      callback(null, obj);
    });
  };

  CommentRepositoryImpl.prototype.updateCache = function (comments) {
    var _this = this;

    comments.forEach(function (c) {
      var issueNumber = CommentRepositoryImpl.getIssueNumber(c);

      if (!_this.issueCommentsMap[issueNumber]) {
        _this.issueCommentsMap[issueNumber] = {};
      }

      _this.issueCommentsMap[issueNumber][c.id] = c;
    });
  };

  CommentRepositoryImpl.getIssueNumber = function (comment) {
    var result = parseInt(comment.html_url.slice(comment.html_url.lastIndexOf('/') + 1).split('#')[0]);
    return result;
  };

  return CommentRepositoryImpl;
}();

exports.CommentRepositoryImpl = CommentRepositoryImpl;
},{}],"infra/github/CommentRepositoryDummy.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CommentRepositoryDummy = void 0; // var gh = new GitHub({token: config.githubToken});
// const issue = gh.getIssues(config.owner, config.repo)
// var root = null;
// function createRoot(issueObject) {
//   return issueObject;
// }
// class ReefTask {
// }

var CommentRepositoryDummy =
/** @class */
function () {
  function CommentRepositoryDummy() {
    this.issueCommentsMap = {};
  }

  CommentRepositoryDummy.prototype.getCommentsForIssue = function (issueNumber) {
    if (!this.issueCommentsMap[issueNumber]) {
      this.issueCommentsMap[issueNumber] = [{
        id: 0,
        body: '2020/1/1\n---\nあああ'
      }];
    }

    return this.issueCommentsMap[issueNumber];
  };

  CommentRepositoryDummy.prototype.refreshNewestUpdateComments = function (since, callback) {
    setTimeout(function () {
      return callback(null, []);
    }, 300);
  };

  CommentRepositoryDummy.prototype.update = function (issueNumber, id, body, callback) {
    var _this = this;

    this.issueCommentsMap[issueNumber][id].body = body;
    setTimeout(function () {
      return callback(null, _this.issueCommentsMap[issueNumber][id]);
    }, 100);
  };

  CommentRepositoryDummy.prototype.create = function (issueNumber, body, callback) {
    var _this = this;

    var id = this.issueCommentsMap[issueNumber].length;
    this.issueCommentsMap[issueNumber].push({
      id: id,
      body: body
    });
    setTimeout(function () {
      return callback(null, _this.issueCommentsMap[issueNumber][_this.issueCommentsMap[issueNumber].length - 1]);
    }, 100);
  };

  return CommentRepositoryDummy;
}();

exports.CommentRepositoryDummy = CommentRepositoryDummy;
},{}],"infra/tasksummary/TaskSummaryImpl.ts":[function(require,module,exports) {
"use strict";

var __spreadArrays = this && this.__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
    s += arguments[i].length;
  }

  for (var r = Array(s), k = 0, i = 0; i < il; i++) {
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
      r[k] = a[j];
    }
  }

  return r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskSummaryRepositoryImpl = exports.MilestoneFactory = exports.DateInTaskFactory = void 0;

var TaskSummary_1 = require("../../domain/TaskSummary");

var DateInTaskFactory =
/** @class */
function () {
  function DateInTaskFactory() {}

  DateInTaskFactory.create = function (dateText, now) {
    var parts = dateText.split('/').map(function (v) {
      return parseInt(v);
    });

    if (parts.length == 2) {
      // ex 6/23
      parts = __spreadArrays([parts[0] <= 3 ? now.getFullYear() + 1 : now.getFullYear()], parts);
    }

    var date = new Date(parts.join('/'));
    return new TaskSummary_1.DateInTask(dateText, date);
  };

  return DateInTaskFactory;
}();

exports.DateInTaskFactory = DateInTaskFactory;

var MilestoneFactory =
/** @class */
function () {
  function MilestoneFactory() {}

  MilestoneFactory.create = function (text, now) {
    if (text.indexOf(' ') == -1) {
      throw "\u30DE\u30A4\u30EB\u30B9\u30C8\u30FC\u30F3\u304C\u30D1\u30FC\u30B9\u3067\u304D\u306A\u3044 " + text;
    }

    var dateText = text.slice(0, text.indexOf(' '));
    var title = text.slice(text.indexOf(' ')).trim();
    return new TaskSummary_1.Milestone(TaskSummary_1.DateInTask.create(dateText, now), title);
  };

  MilestoneFactory.createList = function (text, now) {
    return text.split('\n').map(function (v) {
      return v.trim();
    }).filter(function (v) {
      return v.length > 0;
    }).map(function (v) {
      return MilestoneFactory.create(v, now);
    });
  };

  return MilestoneFactory;
}();

exports.MilestoneFactory = MilestoneFactory;

var TaskSummaryRepositoryImpl =
/** @class */
function () {
  function TaskSummaryRepositoryImpl(issueRepository) {
    this.issueRepository = issueRepository;
  }
  /**
   * issueをsummaryに変換
   * @param issue
   */


  TaskSummaryRepositoryImpl.convert = function (issue, now) {
    // bodyをパース
    var obj = issue.body.split('### ').slice(1).map(function (v) {
      var first = v.split('\n')[0];
      var key = first.trim();

      if (first.indexOf(':') != -1) {
        key = first.split(':')[0].trim();
      }

      var value = v.slice(key.length + 1).trim();
      return {
        key: key,
        value: value
      };
    }).reduce(function (memo, v) {
      memo[v.key] = v.value;
      return memo;
    }, {}); // md形式のリンクリストをパース

    obj['リンク'] = obj['リンク'].split('\n').map(function (v) {
      if (v.indexOf('[') == -1) {
        return {
          title: v,
          path: v,
          isHttp: false
        };
      }

      v = v.slice(v.indexOf('[') + 1);
      var ary = v.split('](');
      var title = ary[0];
      var path = ary[1].slice(0, ary[1].length - 1);
      return {
        title: title,
        path: path,
        isHttp: path.indexOf('http') == 0
      };
    });
    obj.isDone = obj['完了'] && obj['完了'].trim().length > 0;
    obj.isBeforeStartDate = obj['開始日'] && new Date(obj['開始日']) && new Date(obj['開始日']).getTime() > now.getTime(); // issue番号

    obj.issueNumber = issue.number;
    return obj;
  };

  TaskSummaryRepositoryImpl.prototype.getSummary = function (num, now) {
    if (num <= 0) {
      throw '不正な番号';
    } // 担当,関係者,完了,DONEの定義,マイルストーン,開始日,終了日,内容,リンク


    var issue = this.issueRepository.getIssue(num);
    var s = TaskSummaryRepositoryImpl.convert(issue, now);
    return s;
  };

  TaskSummaryRepositoryImpl.prototype.create = function (event, cb) {
    var body = "\n### \u62C5\u5F53: \n### \u95A2\u4FC2\u8005: \n### DONE\u306E\u5B9A\u7FA9: \n### \u30DE\u30A4\u30EB\u30B9\u30C8\u30FC\u30F3: \n### \u958B\u59CB\u65E5: \n### \u7D42\u4E86\u65E5: \n### \u5185\u5BB9: \n### \u30EA\u30F3\u30AF:\n".trim();
    this.issueRepository.createIssue({
      title: event.title,
      body: body
    }, function (err, obj) {
      if (err) {
        cb(err);
        return;
      }

      cb(null, obj.number);
    });
  };

  return TaskSummaryRepositoryImpl;
}();

exports.TaskSummaryRepositoryImpl = TaskSummaryRepositoryImpl;
},{"../../domain/TaskSummary":"domain/TaskSummary.ts"}],"index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
}); /// <reference path="./sugar.d.ts" />

var task_1 = require("./domain/task");

var IssueRepositoryImpl_1 = require("./infra/github/IssueRepositoryImpl");

var IssueRepositoryDummy_1 = require("./infra/github/IssueRepositoryDummy");

var CommentRepositoryImpl_1 = require("./infra/github/CommentRepositoryImpl");

var CommentRepositoryDummy_1 = require("./infra/github/CommentRepositoryDummy");

var TaskSummaryImpl_1 = require("./infra/tasksummary/TaskSummaryImpl");

var TaskNoteRepository =
/** @class */
function () {
  function TaskNoteRepository(commentRepository) {
    this.commentRepository = commentRepository;
  }

  TaskNoteRepository.convert = function (id, body) {
    if (body.indexOf('---') == -1) {
      return null;
    }

    return {
      id: id,
      date: body.slice(0, body.indexOf('---')).trim(),
      body: body.slice(body.indexOf('---') + '---'.length).trim(),
      commentBody: body
    };
  };

  TaskNoteRepository.prototype.getNotes = function (issueNumber) {
    if (issueNumber <= 0) {
      throw '不正な番号';
    } // 担当,関係者,完了,DONEの定義,マイルストーン,開始日,終了日,内容,リンク


    var notes = this.commentRepository.getCommentsForIssue(issueNumber).map(function (v) {
      return TaskNoteRepository.convert(v.id, v.body);
    }).filter(function (v) {
      return v;
    }).sort(function (a, b) {
      if (a.date == b.date) return 0;
      if (a.date > b.date) return -1;
      if (a.date < b.date) return 1;
    }); // exclude null
    // return [{date: '2020/1/1', body: 'hoge'}];

    console.log(issueNumber);
    console.log(notes);
    return notes;
  };

  TaskNoteRepository.prototype.update = function (issueNumber, id, date, body, cb) {
    var comment = ("\n" + date + "\n---\n" + body + "\n        ").trim();
    this.commentRepository.update(issueNumber, id, comment, function (err, obj) {
      cb(err);
    });
  };

  TaskNoteRepository.prototype.createEmpyNote = function (issueNumber, date, cb) {
    var comment = ("\n" + date + "\n---\n        ").trim();
    this.commentRepository.create(issueNumber, comment, function (err, obj) {
      cb(err);
    });
  };

  return TaskNoteRepository;
}();

(function () {
  var issueRepository;
  var commentRepository;
  issueRepository = new IssueRepositoryImpl_1.IssueRepositoryImpl(config.githubToken, config.owner, config.repo);
  commentRepository = new CommentRepositoryImpl_1.CommentRepositoryImpl(config.githubToken, config.owner, config.repo);

  if (config.isDevelop) {
    issueRepository = new IssueRepositoryDummy_1.IssueRepositoryDummy(config.taskRootIssueNumber);
    commentRepository = new CommentRepositoryDummy_1.CommentRepositoryDummy();
  }

  var taskSummaryRepository = new TaskSummaryImpl_1.TaskSummaryRepositoryImpl(issueRepository);
  var taskNoteRepository = new TaskNoteRepository(commentRepository);
  issueRepository.refresh(function (err) {
    if (err) {
      alert(err);
      throw err;
    }

    var rootIssue = issueRepository.getIssue(config.taskRootIssueNumber);
    commentRepository.refreshNewestUpdateComments(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), function (err, obj) {
      if (err) {
        alert(err);
        throw err;
      }

      console.log(obj);
      setup(config.taskRootIssueNumber, rootIssue.body, taskSummaryRepository, taskNoteRepository, issueRepository, new Date());
    });
  });
})();

function getExpandList(list) {
  var result = [];
  list.forEach(function (v) {
    result.push(v);

    if (v.isNode) {
      getExpandList(v.children).forEach(function (p) {
        return result.push(p);
      });
    }
  });
  return result;
}

function findParent(obj, nest) {
  if (nest == 0) {
    return obj;
  }

  var lastTask = obj.children[obj.children.length - 1];
  if (!lastTask.isNode) throw 'データ不正';
  return findParent(lastTask, nest - 1);
} // function parse(text, taskSummaryRepository: TaskSummaryRepository, taskNoteRepository: TaskNoteRepository, now: Date) {
//   var rootObj = {title: '_root', children: [], status: 'opened', isTask: false, summary:null, notes: null, latestNote: null, latestNoteText: ''};
//   var lastObj = rootObj;
//   var parentObj = rootObj;
//   var lastNest = 0;
//   text.trim().split('\n').forEach(line => {
//     var nest = line.split('-')[0].length / 2
//     var title = line.slice(nest * 2 + 2).trim();
//     var issueNumber = -1;
//     if(title.indexOf('[') == 0) {
//       let ary = title.split('/');
//       issueNumber = parseInt(ary[ary.length - 1].split(')')[0]);
//       title = title.split(']')[0].slice(1);
//     }
//     var obj: TaskViewModel = {title: title, nest: `nest${nest}`, children: [], status: 'opened', issueNumber: issueNumber, isTask: true, isIssuedTask: false, summary:null, notes: null, latestNote: null, latestNoteText: '', isDone: false, isBeforeStartDate: false};
//     if(obj.issueNumber > 0) {
//       obj.isIssuedTask = true;
//       obj.summary = taskSummaryRepository.getSummary(obj.issueNumber, now);
//       obj.notes = taskNoteRepository.getNotes(obj.issueNumber)
//       obj.latestNote = obj.notes[0];
//       obj.latestNoteText = obj.notes.length > 0 ? `${obj.notes[0].date}\n${obj.notes[0].body}`.split('\n').join('<br>') : '';
//       obj.isDone = obj.summary.isDone
//       obj.isBeforeStartDate = obj.summary.isBeforeStartDate
//     }
//     // console.log(nest, line);
//     if(lastNest == nest) {
//     }
//     if(lastNest < nest) {
//       parentObj = lastObj;
//     }
//     if(lastNest > nest) {
//       parentObj = findParent(root, nest)
//     }
//     // console.log(parentObj);
//     parentObj.isTask = false;
//     parentObj.children.push(obj)
//     lastObj = obj;
//     lastNest = nest;
//   });
//   // console.log(rootObj.children);
//   return rootObj.children;
// }


function parse2(text, taskSummaryRepository, taskNoteRepository, now) {
  var rootNodeTask = new task_1.NodeTask('_root', [], ''); //{title: '_root', children: [], status: 'opened', isTask: false, summary:null, notes: null, latestNote: null, latestNoteText: ''};

  var lastTask = rootNodeTask;
  var parentTask = rootNodeTask;
  var lastNest = 0;
  text.trim().split('\n').forEach(function (line) {
    var nest = line.split('-')[0].length / 2;
    var title = line.slice(nest * 2 + 2).trim();
    var issueNumber = -1;

    if (title.indexOf('[') == 0) {
      var ary = title.split('/');
      issueNumber = parseInt(ary[ary.length - 1].split(')')[0]);
      title = title.split(']')[0].slice(1);
    }

    var obj = {
      title: title,
      nest: "nest" + nest,
      children: [],
      status: 'opened',
      issueNumber: issueNumber,
      isTask: true,
      isIssuedTask: false,
      summary: null,
      notes: null,
      latestNote: null,
      latestNoteText: '',
      isDone: false,
      isBeforeStartDate: false
    };
    var task;

    if (obj.issueNumber > 0) {
      // managedTask
      task = new task_1.ManagedTask(obj.issueNumber, obj.title, taskSummaryRepository.getSummary(obj.issueNumber, now), taskNoteRepository.getNotes(obj.issueNumber)[0], obj.nest);
    } else {
      task = new task_1.NodeTask(obj.title, [], obj.nest);
    } // console.log(nest, line);


    if (lastNest == nest) {}

    if (lastNest < nest) {
      if (lastTask.isManaged) throw 'データ不正';
      parentTask = lastTask;
    }

    if (lastNest > nest) {
      parentTask = findParent(rootNodeTask, nest);
    } // console.log(parentObj);


    parentTask.addChildren(task);
    lastTask = task;
    lastNest = nest;
  }); // console.log(rootObj.children);

  return rootNodeTask.children;
}

function setup(taskRootIssueNumber, rootBody, taskSummaryRepository, taskNoteRepository, issueRepository, now) {
  console.log('rootBody', rootBody);
  var tasks = parse2(rootBody, taskSummaryRepository, taskNoteRepository, now);
  console.log(tasks);
  var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!',
      list: tasks,
      rootBody: rootBody,
      filter: '',
      owner: config.owner,
      repo: config.repo,
      issueUrlPrefix: "https://github.com/" + config.owner + "/" + config.repo + "/issues"
    },
    computed: {
      expandList: function expandList() {
        var _this = this;

        var result = getExpandList(this.list);
        result = result.map(function (v) {
          if (_this.filter.trim().length == 0) {
            v.isHilight = false;
          } else if (v.title.indexOf(_this.filter) != -1) {
            v.isHilight = true;
          } else if (v.summary) {
            if (v.summary['担当'].indexOf(_this.filter) != -1) {
              v.isHilight = true;
            }
          } else {
            v.isHilight = false;
          }

          return v;
        });
        return result;
      }
    },
    methods: {
      reload: function reload() {
        this.list = parse2(this.rootBody, taskSummaryRepository, taskNoteRepository, now);
      },
      onPressedRootBodyEdit: function onPressedRootBodyEdit() {
        var _this = this;

        issueRepository.updateBody(taskRootIssueNumber, this.rootBody, function (err, obj) {
          return _this.reload();
        });
      },
      br: function br(text) {
        return text.split('\n').join('<br>');
      },
      editComment: function editComment(issueNumber, id, date, selector) {
        var _this = this;

        var body = document.querySelector(selector).value;
        console.log(issueNumber, id, document.querySelector(selector).value);
        taskNoteRepository.update(issueNumber, id, date, body, function (err) {
          if (err) {
            alert(err);
            throw err;
          }

          _this.reload();
        });
      },
      createTask: function createTask(nodeTask) {
        var _this = this;

        var event = nodeTask.toMangedTask();
        taskSummaryRepository.create(event, function (err, issueNumber) {
          if (err) {
            alert(err);
            throw err;
          }

          console.log(nodeTask);
          _this.rootBody = _this.rootBody.split(event.title).join("[" + event.title + "](" + _this.issueUrlPrefix + "/" + issueNumber + ")");

          _this.onPressedRootBodyEdit();
        });
      },
      createNote: function createNote(issueNumber) {
        var _this = this;

        var date = new Date();
        date.setDate(date.getDate() - date.getDay() + 1); // 月曜日

        var d = date.getFullYear() + "/" + zerofil(date.getMonth() + 1) + "/" + zerofil(date.getDate());
        console.log(d);
        taskNoteRepository.createEmpyNote(issueNumber, d, function (err) {
          if (err) {
            alert(err);
            throw err;
          }

          _this.reload();
        });
      }
    }
  });
}

function zerofil(num) {
  return ("0" + num).slice(-2);
}

console.log(new Sugar.Date('2 weeks ago').getMonth());
},{"./domain/task":"domain/task.ts","./infra/github/IssueRepositoryImpl":"infra/github/IssueRepositoryImpl.ts","./infra/github/IssueRepositoryDummy":"infra/github/IssueRepositoryDummy.ts","./infra/github/CommentRepositoryImpl":"infra/github/CommentRepositoryImpl.ts","./infra/github/CommentRepositoryDummy":"infra/github/CommentRepositoryDummy.ts","./infra/tasksummary/TaskSummaryImpl":"infra/tasksummary/TaskSummaryImpl.ts"}],"../../../../../../usr/local/lib/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57858" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../usr/local/lib/node_modules/parcel/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/index.js.map