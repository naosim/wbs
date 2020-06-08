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
})({"infra/github/IssueRepositoryImpl.ts":[function(require,module,exports) {
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
var body26 = "\n### \u62C5\u5F53: \u3059\u305A\u304D\n### \u95A2\u4FC2\u8005: \u3055\u3068\u3046\n### DONE\u306E\u5B9A\u7FA9: \u7D42\u308F\u3089\u3059\n### \u30DE\u30A4\u30EB\u30B9\u30C8\u30FC\u30F3\n2020/06/06 \u59CB\u307E\u308A\u306E\u5100\n7/9 \u7D42\u308F\u308A\u306E\u5100\n### \u958B\u59CB\u65E5: 2020/05/11\n### \u7D42\u4E86\u65E5: 2020/05/29\n### \u5185\u5BB9\n5/28\u306B\u3084\u308B\n\u9811\u5F35\u308B\n### \u30EA\u30F3\u30AF:\n- [yahoo](http://www.yahoo.co.jp)\n".trim();
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
    }); // console.log(this.issueCommentsMap[issueNumber]);

    setTimeout(function () {
      return callback(null, _this.issueCommentsMap[issueNumber][_this.issueCommentsMap[issueNumber].length - 1]);
    }, 100);
  };

  return CommentRepositoryDummy;
}();

exports.CommentRepositoryDummy = CommentRepositoryDummy;
},{}],"domain/TaskSummary.ts":[function(require,module,exports) {
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
exports.CreateTaskSummaryEvent = exports.DateInTask = exports.Milestones = exports.Milestone = exports.TaskSummary = void 0;

var TaskSummary =
/** @class */
function () {
  function TaskSummary(org) {
    this.taskId = org.taskId;
    this.issueNumber = org.issueNumber;
    this.isDone = org.isDone;
    this.isBeforeStartDate = org.isBeforeStartDate;
    this.milestones = org.milestones;
    this.assign = org.assign;
    this.related = org.related;
    this.goal = org.goal;
    this.startDate = org.startDate;
    this.endDate = org.endDate;
    this.completeDate = org.completeDate;
    this.description = org.description;
    this.links = org.links;
  }

  TaskSummary.prototype.updateMilestones = function (milestones) {
    var result = new TaskSummary(this);
    result.milestones = milestones;
    return result;
  };

  TaskSummary.prototype.updateAssign = function (assign) {
    var result = new TaskSummary(this);
    result.assign = assign;
    return result;
  };

  TaskSummary.prototype.updateGoal = function (goal) {
    var result = new TaskSummary(this);
    result.goal = goal;
    return result;
  };

  return TaskSummary;
}();

exports.TaskSummary = TaskSummary;
/*
### 担当:
### 関係者:
### DONEの定義:
### マイルストーン:
### 開始日:
### 終了日:
### 内容:
### リンク:
*/

var Milestone =
/** @class */
function () {
  function Milestone(dateInTask, title, now) {
    var _this = this;

    this.dateInTask = dateInTask;
    this.title = title;
    this.now = now;
    this.isDone = ['done', '完了', '了', '済', '済み'].some(function (key) {
      return _this.title.indexOf("[" + key + "]") != -1;
    });
  }

  Object.defineProperty(Milestone.prototype, "dateText", {
    get: function get() {
      return this.dateInTask.text;
    },
    enumerable: false,
    configurable: true
  });

  Milestone.prototype.isWithin = function (pastDate) {
    if (this.isDone) {
      return false;
    }

    return this.dateInTask.isWithin(pastDate);
  };

  Object.defineProperty(Milestone.prototype, "isWithinOneWeek", {
    get: function get() {
      return this.isWithin(new Date(this.now.getTime() + 7 * 24 * 60 * 60 * 1000));
    },
    enumerable: false,
    configurable: true
  });
  return Milestone;
}();

exports.Milestone = Milestone;

var Milestones =
/** @class */
function () {
  function Milestones(list) {
    this.list = list;
  }

  return Milestones;
}();

exports.Milestones = Milestones;

var DateInTask =
/** @class */
function () {
  function DateInTask(text, date) {
    this.text = text;
    this.date = date;
  }

  DateInTask.prototype.isWithin = function (pastDate) {
    return this.date.getTime() <= pastDate.getTime();
  };

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

var CreateTaskSummaryEvent =
/** @class */
function () {
  function CreateTaskSummaryEvent(title) {
    this.title = title;
  }

  return CreateTaskSummaryEvent;
}();

exports.CreateTaskSummaryEvent = CreateTaskSummaryEvent;
},{}],"infra/tasksummary/MilestoneFactory.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MilestoneFactory = void 0;

var TaskSummary_1 = require("../../domain/TaskSummary");

var MilestoneFactory =
/** @class */
function () {
  function MilestoneFactory() {} // パターン
  // 2020/1/1 タスク名
  // 2020/1/1　タスク名全角区切り
  // 1/1 タスク名
  // タスク名 ほげ
  // 1/末 タスク名


  MilestoneFactory.create = function (text, now) {
    var splitKey = ' ';

    if (text.indexOf(splitKey) == -1) {
      splitKey = '　';

      if (text.indexOf(splitKey) == -1) {
        // throw `マイルストーンがパースできない ${text}`
        var title = text;
        return new TaskSummary_1.Milestone(new TaskSummary_1.DateInTask('', new Date('2999/12/31')), title, now);
      }
    }

    var dateText = text.slice(0, text.indexOf(splitKey));
    var title = text.slice(text.indexOf(splitKey)).trim();
    return new TaskSummary_1.Milestone(TaskSummary_1.DateInTask.create(dateText, now), title, now);
  };

  MilestoneFactory.createMilestones = function (text, now) {
    return new TaskSummary_1.Milestones(text.split('\n').map(function (v) {
      return v.trim();
    }).filter(function (v) {
      return v.length > 0;
    }).map(function (v) {
      return MilestoneFactory.create(v, now);
    }));
  };

  return MilestoneFactory;
}();

exports.MilestoneFactory = MilestoneFactory;
},{"../../domain/TaskSummary":"domain/TaskSummary.ts"}],"infra/tasksummary/TaskSummaryImpl.ts":[function(require,module,exports) {
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
exports.TaskSummaryRepositoryImpl = exports.DateInTaskFactory = void 0;

var TaskSummary_1 = require("../../domain/TaskSummary");

var MilestoneFactory_1 = require("./MilestoneFactory");

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


  TaskSummaryRepositoryImpl.convert = function (issue, taskId, now) {
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

    obj['リンク'] = obj['リンク'].split('\n').filter(function (v) {
      return v.length > 0;
    }).map(function (v) {
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
    obj.links = obj['リンク'];
    obj.isDone = obj['完了'] && obj['完了'].trim().length > 0;
    obj.isBeforeStartDate = obj['開始日'] && new Date(obj['開始日']) && new Date(obj['開始日']).getTime() > now.getTime();
    obj.milestones = MilestoneFactory_1.MilestoneFactory.createMilestones(obj['マイルストーン'], now);
    /*
    milestones: Milestones,
    assign: string,
    related: string,
    goal: string,
    startDate: DateInTask,
    endDate: DateInTask,
    description: string,
    links: []
    */

    obj.assign = obj['担当'];
    obj.related = obj['関係者'];
    obj.goal = obj['DONEの定義'];
    obj.description = obj['内容'];
    obj.startDate = obj['開始日'].length > 0 ? DateInTaskFactory.create(obj['開始日'], now) : null;
    obj.endDate = obj['終了日'].length > 0 ? DateInTaskFactory.create(obj['終了日'], now) : null;
    obj.completeDate = obj['完了'] && obj['完了'].length > 0 ? DateInTaskFactory.create(obj['完了'], now) : null; // issue番号

    obj.issueNumber = issue.number || taskId;
    obj.taskId = issue.number || taskId;
    return new TaskSummary_1.TaskSummary(obj);
  };

  TaskSummaryRepositoryImpl.prototype.getSummary = function (num, now) {
    if (num <= 0) {
      throw '不正な番号';
    } // 担当,関係者,完了,DONEの定義,マイルストーン,開始日,終了日,内容,リンク


    var issue = this.issueRepository.getIssue(num);
    var s = TaskSummaryRepositoryImpl.convert(issue, num, now);
    return s;
  };

  TaskSummaryRepositoryImpl.prototype.create = function (event, cb) {
    var body = "\n### \u62C5\u5F53: \n### \u95A2\u4FC2\u8005: \n### DONE\u306E\u5B9A\u7FA9: \n### \u30DE\u30A4\u30EB\u30B9\u30C8\u30FC\u30F3: \n### \u958B\u59CB\u65E5: \n### \u7D42\u4E86\u65E5: \n### \u5185\u5BB9: \n### \u30EA\u30F3\u30AF:\n### \u5B8C\u4E86:\n".trim();
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

  TaskSummaryRepositoryImpl.prototype.update = function (summary, cb) {
    var map = TaskSummaryRepositoryImpl.toMap(summary);
    var text = Object.keys(map).map(function (k) {
      var value = map[k];

      if (value && value.split('\n').length >= 2) {
        return "### " + k + "\n" + value;
      } else if (value && value.indexOf('- ') == 0) {
        return "### " + k + "\n" + value;
      }

      return "### " + k + ": " + value;
    }).join('\n');
    console.log(text);
    this.issueRepository.updateBody(summary.taskId, text, cb);
  };

  TaskSummaryRepositoryImpl.toMap = function (summary) {
    return {
      '担当': summary.assign,
      '関係者': summary.related,
      'DONEの定義': summary.goal,
      'マイルストーン': summary.milestones.list.map(function (v) {
        return v.dateText + " " + v.title;
      }).join('\n'),
      '開始日': summary.startDate ? summary.startDate.text : '',
      '終了日': summary.endDate ? summary.endDate.text : '',
      '内容': summary.description,
      'リンク': summary.links.map(function (v) {
        return "- [" + v.title + "](" + v.path + ")";
      }).join('\n'),
      '完了': summary.completeDate ? summary.completeDate.text : ''
    };
  };

  return TaskSummaryRepositoryImpl;
}();

exports.TaskSummaryRepositoryImpl = TaskSummaryRepositoryImpl;
},{"../../domain/TaskSummary":"domain/TaskSummary.ts","./MilestoneFactory":"infra/tasksummary/MilestoneFactory.ts"}],"domain/TaskNote.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateEmptyNoteEvent = exports.UpdateNoteEvent = exports.Notes = exports.Note = void 0;

var Note =
/** @class */
function () {
  function Note(taskId, id, date, body) {
    this.taskId = taskId;
    this.id = id;
    this.date = date;
    this.body = body;
  }

  Note.prototype.updateBody = function (body) {
    return new UpdateNoteEvent(this.taskId, this.id, this.date, body);
  };

  return Note;
}();

exports.Note = Note;

var Notes =
/** @class */
function () {
  function Notes(taskId, list) {
    this.taskId = taskId;
    this.list = list;
  }

  Object.defineProperty(Notes.prototype, "latestNote", {
    get: function get() {
      return this.list.length > 0 ? this.list[0] : null;
    },
    enumerable: false,
    configurable: true
  });

  Notes.prototype.createEmptyNote = function (now) {
    var date = new Date(now);
    date.setDate(date.getDay() == 0 ? date.getDate() - 6 : date.getDate() - date.getDay() + 1); // 月曜日

    date = new Date(date.toDateString());

    if (this.latestNote && this.latestNote.date.getTime() == date.getTime()) {
      throw '既に最新のノートがある';
    }

    return new CreateEmptyNoteEvent(this.taskId, date);
  };

  return Notes;
}();

exports.Notes = Notes;

var UpdateNoteEvent =
/** @class */
function () {
  function UpdateNoteEvent(taskId, id, date, body) {
    this.taskId = taskId;
    this.id = id;
    this.date = date;
    this.body = body;
  }

  return UpdateNoteEvent;
}();

exports.UpdateNoteEvent = UpdateNoteEvent;

var CreateEmptyNoteEvent =
/** @class */
function () {
  function CreateEmptyNoteEvent(taskId, date) {
    this.taskId = taskId;
    this.date = date;
  }

  return CreateEmptyNoteEvent;
}();

exports.CreateEmptyNoteEvent = CreateEmptyNoteEvent;
},{}],"infra/tasknote/TaskNoteRepositoryImpl.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskNoteRepositoryImpl = void 0;

var TaskNote_1 = require("../../domain/TaskNote");

var TaskNoteRepositoryImpl =
/** @class */
function () {
  function TaskNoteRepositoryImpl(commentRepository) {
    this.commentRepository = commentRepository;
  }

  TaskNoteRepositoryImpl.convert = function (id, body) {
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

  TaskNoteRepositoryImpl.createCommentText = function (date, body) {
    return date.toLocaleDateString() + "\n---\n" + body.trim();
  };

  TaskNoteRepositoryImpl.prototype.getNotes = function (taskId) {
    if (taskId <= 0) {
      throw '不正な番号';
    } // 担当,関係者,完了,DONEの定義,マイルストーン,開始日,終了日,内容,リンク


    var notes = this.commentRepository.getCommentsForIssue(taskId).map(function (v) {
      return TaskNoteRepositoryImpl.convert(v.id, v.body);
    }).filter(function (v) {
      return v;
    }).map(function (v) {
      return new TaskNote_1.Note(taskId, v.id, new Date(v.date), v.body);
    }).sort(function (a, b) {
      a = a.date.getTime();
      b = b.date.getTime();
      if (a == b) return 0;
      if (a > b) return -1;
      if (a < b) return 1;
    }); // exclude null
    // return [{date: '2020/1/1', body: 'hoge'}];

    return new TaskNote_1.Notes(taskId, notes);
  };

  TaskNoteRepositoryImpl.prototype.update = function (event, cb) {
    this.commentRepository.update(event.taskId, event.id, TaskNoteRepositoryImpl.createCommentText(event.date, event.body), function (err, obj) {
      cb(err);
    });
  };

  TaskNoteRepositoryImpl.prototype.createEmptyNote = function (event, cb) {
    this.commentRepository.create(event.taskId, TaskNoteRepositoryImpl.createCommentText(event.date, ''), function (err, obj) {
      cb(err);
    });
  };

  return TaskNoteRepositoryImpl;
}();

exports.TaskNoteRepositoryImpl = TaskNoteRepositoryImpl;
},{"../../domain/TaskNote":"domain/TaskNote.ts"}],"domain/TaskTree.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskTreeRepository = exports.TaskTitleAndId = exports.TreeNode = void 0;

var TreeNode =
/** @class */
function () {
  function TreeNode(value, children) {
    if (children === void 0) {
      children = [];
    }

    this.value = value;
    this.children = children;
  }

  Object.defineProperty(TreeNode.prototype, "hasChildren", {
    get: function get() {
      return this.children.length > 0;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(TreeNode.prototype, "lastChild", {
    get: function get() {
      if (!this.hasChildren) throw 'no children';
      return this.children[this.children.length - 1];
    },
    enumerable: false,
    configurable: true
  });

  TreeNode.prototype.addChild = function (node) {
    this.children.push(node);
  };

  return TreeNode;
}();

exports.TreeNode = TreeNode;

var TaskTitleAndId =
/** @class */
function () {
  function TaskTitleAndId(title, taskId) {
    this.title = title;
    this.taskId = taskId;
  }

  return TaskTitleAndId;
}();

exports.TaskTitleAndId = TaskTitleAndId;

function convertToTree(text) {
  var root = new TreeNode(new TaskTitleAndId('_root'));
  var lastNodes = [root];
  text.trim().split('\n').forEach(function (line) {
    var nest = line.split('-')[0].length / 2 + 1; //1 origin

    var node = new TreeNode(textToTaskTitleAndId(line.trim().slice(2)));
    lastNodes[nest] = node;
    lastNodes[nest - 1].addChild(node);
  });
  return root;
}

function textToTaskTitleAndId(text) {
  if (text.indexOf('[') != 0) {
    return new TaskTitleAndId(text);
  }

  var ary = text.split('/');
  var taskId = parseInt(ary[ary.length - 1].split(')')[0]);
  var title = text.split(']')[0].slice(1);
  return new TaskTitleAndId(title, taskId);
}

var TaskTreeRepository =
/** @class */
function () {
  function TaskTreeRepository(taskRootIssueNumber, issueRepository) {
    this.taskRootIssueNumber = taskRootIssueNumber;
    this.issueRepository = issueRepository;
  }

  TaskTreeRepository.prototype.getTaskTree = function () {
    var taskRootText = this.issueRepository.getIssue(this.taskRootIssueNumber).body;
    return convertToTree(taskRootText);
  };

  TaskTreeRepository.prototype.getTaskRootBody = function () {
    return this.issueRepository.getIssue(this.taskRootIssueNumber).body;
  };

  TaskTreeRepository.prototype.updateTaskRootBody = function (taskRootBody, cb) {
    this.issueRepository.updateBody(this.taskRootIssueNumber, taskRootBody, cb);
  };

  TaskTreeRepository.prototype.updateTaskTitleAndId = function (taskTitleAndId, cb) {
    var rootBody = this.getTaskRootBody().split(taskTitleAndId.title).join("[" + taskTitleAndId.title + "](./" + taskTitleAndId.taskId + ")");
    this.updateTaskRootBody(rootBody, cb);
  };

  return TaskTreeRepository;
}();

exports.TaskTreeRepository = TaskTreeRepository;
},{}],"domain/task.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ManagedTask = exports.TitleOnlyTask = exports.NodeTask = void 0;

var TaskSummary_1 = require("./TaskSummary");

var NodeTask =
/** @class */
function () {
  function NodeTask(title, children, nest) {
    this.title = title;
    this.children = children;
    this.nest = nest;
    this.isNode = true;
    this.isTitleOnly = false;
    this.isManaged = false;
    this.status = 'opened';
  }

  return NodeTask;
}();

exports.NodeTask = NodeTask;

var TitleOnlyTask =
/** @class */
function () {
  function TitleOnlyTask(title, nest) {
    this.title = title;
    this.nest = nest;
    this.isNode = false;
    this.isTitleOnly = true;
    this.isManaged = false;
  }

  TitleOnlyTask.prototype.toMangedTask = function () {
    return new TaskSummary_1.CreateTaskSummaryEvent(this.title);
  };

  return TitleOnlyTask;
}();

exports.TitleOnlyTask = TitleOnlyTask;

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
},{"./TaskSummary":"domain/TaskSummary.ts"}],"TaskListFactory.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskListFactory = void 0;

var task_1 = require("./domain/task");

var TaskListFactory =
/** @class */
function () {
  function TaskListFactory(taskSummaryRepository, taskNoteRepository, taskTreeRepository, now) {
    this.taskSummaryRepository = taskSummaryRepository;
    this.taskNoteRepository = taskNoteRepository;
    this.taskTreeRepository = taskTreeRepository;
    this.now = now;
  }

  TaskListFactory.prototype.create = function () {
    var tree = this.taskTreeRepository.getTaskTree();
    return this.flat(this.treeNodeToTask(tree, -1)).slice(1);
  };

  TaskListFactory.prototype.treeNodeToTask = function (node, nestNum) {
    var _this = this;

    if (nestNum === void 0) {
      nestNum = 0;
    }

    var title = node.value.title;
    var nest = "nest" + nestNum;

    if (node.value.taskId) {
      // managed
      return new task_1.ManagedTask(node.value.taskId, title, this.taskSummaryRepository.getSummary(node.value.taskId, this.now), this.taskNoteRepository.getNotes(node.value.taskId).latestNote, nest);
    } else if (node.hasChildren) {
      return new task_1.NodeTask(title, node.children.map(function (v) {
        return _this.treeNodeToTask(v, nestNum + 1);
      }), nest);
    } else {
      return new task_1.TitleOnlyTask(title, nest);
    }
  };

  TaskListFactory.prototype.flat = function (task, list) {
    var _this = this;

    if (list === void 0) {
      list = [];
    }

    list.push(task);

    if (task.isNode) {
      task.children.forEach(function (v) {
        return _this.flat(v, list);
      });
    }

    return list;
  };

  return TaskListFactory;
}();

exports.TaskListFactory = TaskListFactory;
},{"./domain/task":"domain/task.ts"}],"service/TitleOnlyToMangedService.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TitleOnlyToMangedService = void 0;

var TaskTree_1 = require("../domain/TaskTree");

var TitleOnlyToMangedService =
/** @class */
function () {
  function TitleOnlyToMangedService(taskSummaryRepository, taskTreeRepository) {
    this.taskSummaryRepository = taskSummaryRepository;
    this.taskTreeRepository = taskTreeRepository;
  }

  TitleOnlyToMangedService.prototype.convert = function (titleOnlyTask, cb) {
    var _this = this;

    var event = titleOnlyTask.toMangedTask();
    this.taskSummaryRepository.create(event, function (err, issueNumber) {
      if (err) {
        cb(err);
        return;
      }

      _this.taskTreeRepository.updateTaskTitleAndId(new TaskTree_1.TaskTitleAndId(event.title, issueNumber), cb);
    });
  };

  return TitleOnlyToMangedService;
}();

exports.TitleOnlyToMangedService = TitleOnlyToMangedService;
},{"../domain/TaskTree":"domain/TaskTree.ts"}],"service/UpdateNoteBodyService.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UpdateNoteBodyService = void 0;

var UpdateNoteBodyService =
/** @class */
function () {
  function UpdateNoteBodyService(taskNoteRepository) {
    this.taskNoteRepository = taskNoteRepository;
  }

  UpdateNoteBodyService.prototype.update = function (note, body, cb) {
    var event = note.updateBody(body);
    this.taskNoteRepository.update(event, cb);
  };

  return UpdateNoteBodyService;
}();

exports.UpdateNoteBodyService = UpdateNoteBodyService;
},{}],"service/CreateEmptyNoteService.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateEmptyNoteService = void 0;

var CreateEmptyNoteService =
/** @class */
function () {
  function CreateEmptyNoteService(taskNoteRepository, now) {
    this.taskNoteRepository = taskNoteRepository;
    this.now = now;
  }

  CreateEmptyNoteService.prototype.create = function (taskId, cb) {
    var event = this.taskNoteRepository.getNotes(taskId).createEmptyNote(this.now);
    this.taskNoteRepository.createEmptyNote(event, cb);
  };

  return CreateEmptyNoteService;
}();

exports.CreateEmptyNoteService = CreateEmptyNoteService;
},{}],"index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var IssueRepositoryImpl_1 = require("./infra/github/IssueRepositoryImpl");

var IssueRepositoryDummy_1 = require("./infra/github/IssueRepositoryDummy");

var CommentRepositoryImpl_1 = require("./infra/github/CommentRepositoryImpl");

var CommentRepositoryDummy_1 = require("./infra/github/CommentRepositoryDummy");

var TaskSummaryImpl_1 = require("./infra/tasksummary/TaskSummaryImpl");

var TaskNoteRepositoryImpl_1 = require("./infra/tasknote/TaskNoteRepositoryImpl");

var TaskTree_1 = require("./domain/TaskTree");

var TaskListFactory_1 = require("./TaskListFactory");

var TitleOnlyToMangedService_1 = require("./service/TitleOnlyToMangedService");

var UpdateNoteBodyService_1 = require("./service/UpdateNoteBodyService");

var CreateEmptyNoteService_1 = require("./service/CreateEmptyNoteService");

var MilestoneFactory_1 = require("./infra/tasksummary/MilestoneFactory");

var Services =
/** @class */
function () {
  function Services(titleOnlyToMangedService, updateNoteBodyService, createEmptyNoteService) {
    this.titleOnlyToMangedService = titleOnlyToMangedService;
    this.updateNoteBodyService = updateNoteBodyService;
    this.createEmptyNoteService = createEmptyNoteService;
  }

  return Services;
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
  var taskNoteRepository = new TaskNoteRepositoryImpl_1.TaskNoteRepositoryImpl(commentRepository);
  var taskTreeRepository = new TaskTree_1.TaskTreeRepository(config.taskRootIssueNumber, issueRepository);
  issueRepository.refresh(function (err) {
    if (err) {
      alert(err);
      throw err;
    }

    commentRepository.refreshNewestUpdateComments(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), function (err, obj) {
      if (err) {
        alert(err);
        throw err;
      }

      setup(taskSummaryRepository, taskNoteRepository, taskTreeRepository, new Date());
    });
  });
})();

function setup(taskSummaryRepository, taskNoteRepository, taskTreeRepository, now) {
  var taskListFactory = new TaskListFactory_1.TaskListFactory(taskSummaryRepository, taskNoteRepository, taskTreeRepository, now);
  var tasks = taskListFactory.create().map(function (v) {
    if (!v.isManaged) {
      return v;
    }

    v = v;
    var obj = v; // vue用に変更

    obj.editingMilestonesText = v.summary.milestones.list.map(function (v) {
      return v.dateText + " " + v.title;
    }).join('\n');
    v.isEditingMilestones = false;
    return obj;
  });

  var callbackToReload = function callbackToReload(err) {
    if (err) throw err;
    app.reload();
  };

  var services = new Services(new TitleOnlyToMangedService_1.TitleOnlyToMangedService(taskSummaryRepository, taskTreeRepository), new UpdateNoteBodyService_1.UpdateNoteBodyService(taskNoteRepository), new CreateEmptyNoteService_1.CreateEmptyNoteService(taskNoteRepository, now));
  var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!',
      list: []
      /*tasks*/
      ,
      rootBody: ''
      /*taskTreeRepository.getTaskRootBody()*/
      ,
      filter: '',
      owner: config.owner,
      repo: config.repo,
      issueUrlPrefix: "https://github.com/" + config.owner + "/" + config.repo + "/issues",
      filterCheckbox: {
        'title': {
          label: '件名',
          checked: true
        },
        'assgin': {
          label: '担当',
          checked: true
        },
        'body': {
          label: '内容',
          checked: true
        },
        'milestone': {
          label: 'マイルストーン',
          checked: true
        },
        'latestnote': {
          label: '最新状況',
          checked: true
        }
      }
    },
    computed: {
      decoratedList: function decoratedList() {
        var _this = this;

        console.log('decoratedList');
        var result = this.list;
        var filterTargetsForSummary = ['担当', '内容', 'マイルストーン'];
        var fitlerTargetMap = {
          'title': function title(v) {
            return v.title.indexOf(_this.filter) != -1;
          },
          'assgin': function assgin(v) {
            return v.isManaged && v.summary['担当'].indexOf(_this.filter) != -1;
          },
          'body': function body(v) {
            return v.isManaged && v.summary['内容'].indexOf(_this.filter) != -1;
          },
          'milestone': function milestone(v) {
            return v.isManaged && v.summary['マイルストーン'].indexOf(_this.filter) != -1;
          },
          'latestnote': function latestnote(v) {
            return v.isManaged && v.latestNoteText.indexOf(_this.filter) != -1;
          }
        };
        result = result.map(function (v) {
          v.isHilight = false;

          if (_this.filter.trim().length == 0) {
            v.isHilight = false;
          } else if (Object.keys(fitlerTargetMap).filter(function (key) {
            return _this.filterCheckbox[key].checked;
          }).some(function (key) {
            return fitlerTargetMap[key](v);
          })) {
            v.isHilight = true;
          }

          v.isEditingMilestones = false;
          return v;
        });
        return result;
      }
    },
    methods: {
      reload: function reload() {
        this.list = taskListFactory.create().map(function (v) {
          if (!v.isManaged) {
            return v;
          }

          v = v;
          var obj = v; // vue用に変更

          var editingText = {
            milestones: v.summary.milestones.list.map(function (v) {
              return v.dateText + " " + v.title;
            }).join('\n'),
            isEditingMilestones: false,
            assign: v.summary.assign,
            isEditingAssign: false,
            goal: v.summary.goal,
            isEditingGoal: false
          };
          obj.editingText = editingText;
          return obj;
        });
        this.rootBody = taskTreeRepository.getTaskRootBody();
      },
      onPressedRootBodyEdit: function onPressedRootBodyEdit() {
        taskTreeRepository.updateTaskRootBody(this.rootBody, callbackToReload);
      },
      br: function br(text) {
        return text.split('\n').join('<br>');
      },
      createTask: function createTask(titleOnlyTask) {
        services.titleOnlyToMangedService.convert(titleOnlyTask, callbackToReload);
      },
      editNote: function editNote(note, selector) {
        var body = document.querySelector(selector).value.trim();
        services.updateNoteBodyService.update(note, body, callbackToReload);
      },
      createNote: function createNote(taskId) {
        services.createEmptyNoteService.create(taskId, callbackToReload);
      },
      updateSummary: function updateSummary(obj) {
        console.log(obj);
        var editingText = obj.editingText;
        var summary = taskSummaryRepository.getSummary(obj.taskId, now).updateMilestones(MilestoneFactory_1.MilestoneFactory.createMilestones(editingText.milestones, now)).updateAssign(editingText.assign).updateGoal(editingText.goal);
        taskSummaryRepository.update(summary, callbackToReload);
      }
    }
  });
  app.reload();
}
},{"./infra/github/IssueRepositoryImpl":"infra/github/IssueRepositoryImpl.ts","./infra/github/IssueRepositoryDummy":"infra/github/IssueRepositoryDummy.ts","./infra/github/CommentRepositoryImpl":"infra/github/CommentRepositoryImpl.ts","./infra/github/CommentRepositoryDummy":"infra/github/CommentRepositoryDummy.ts","./infra/tasksummary/TaskSummaryImpl":"infra/tasksummary/TaskSummaryImpl.ts","./infra/tasknote/TaskNoteRepositoryImpl":"infra/tasknote/TaskNoteRepositoryImpl.ts","./domain/TaskTree":"domain/TaskTree.ts","./TaskListFactory":"TaskListFactory.ts","./service/TitleOnlyToMangedService":"service/TitleOnlyToMangedService.ts","./service/UpdateNoteBodyService":"service/UpdateNoteBodyService.ts","./service/CreateEmptyNoteService":"service/CreateEmptyNoteService.ts","./infra/tasksummary/MilestoneFactory":"infra/tasksummary/MilestoneFactory.ts"}],"../../../../../../usr/local/lib/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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