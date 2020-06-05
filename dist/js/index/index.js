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
var text = "\n- \u5B66\u696D\n  - \u5BBF\u984C\n    - [5\u6708\u5206](/26)\n    - 6\u6708\u5206\n- \u904A\u3073\n  - [\u65C5\u884C](/5)\n".trim();
var body26 = "\n### \u62C5\u5F53: \u3059\u305A\u304D\n### \u95A2\u4FC2\u8005: \u3055\u3068\u3046\n### DONE\u306E\u5B9A\u7FA9: \u7D42\u308F\u3089\u3059\n### \u30DE\u30A4\u30EB\u30B9\u30C8\u30FC\u30F3: \n### \u958B\u59CB\u65E5: 2020/05/11\n### \u7D42\u4E86\u65E5: 2020/05/29\n### \u5185\u5BB9\n5/28\u306B\u3084\u308B\n\u9811\u5F35\u308B\n### \u30EA\u30F3\u30AF:\n- [yahoo](http://www.yahoo.co.jp)\n".trim();
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
},{}],"index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var IssueRepositoryImpl_1 = require("./infra/github/IssueRepositoryImpl");

var IssueRepositoryDummy_1 = require("./infra/github/IssueRepositoryDummy");

var CommentRepositoryImpl_1 = require("./infra/github/CommentRepositoryImpl");

var CommentRepositoryDummy_1 = require("./infra/github/CommentRepositoryDummy");

var TaskSummaryRepository =
/** @class */
function () {
  function TaskSummaryRepository(issueRepository) {
    this.issueRepository = issueRepository;
  }
  /**
   * issueをsummaryに変換
   * @param issue
   */


  TaskSummaryRepository.convert = function (issue) {
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
    obj.isDone = obj['完了'] && obj['完了'].trim().length > 0; // issue番号

    obj.issueNumber = issue.number;
    return obj;
  };

  TaskSummaryRepository.prototype.getSummary = function (num) {
    if (num <= 0) {
      throw '不正な番号';
    } // 担当,関係者,完了,DONEの定義,マイルストーン,開始日,終了日,内容,リンク


    var issue = this.issueRepository.getIssue(num);
    var s = TaskSummaryRepository.convert(issue);
    return s;
  };

  TaskSummaryRepository.prototype.create = function (title, cb) {
    var body = "\n### \u62C5\u5F53: \n### \u95A2\u4FC2\u8005: \n### DONE\u306E\u5B9A\u7FA9: \n### \u30DE\u30A4\u30EB\u30B9\u30C8\u30FC\u30F3: \n### \u958B\u59CB\u65E5: \n### \u7D42\u4E86\u65E5: \n### \u5185\u5BB9: \n### \u30EA\u30F3\u30AF:\n".trim();
    this.issueRepository.createIssue({
      title: title,
      body: body
    }, function (err, obj) {
      if (err) {
        cb(err);
        return;
      }

      cb(null, obj.number);
    });
  };

  return TaskSummaryRepository;
}();

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

  var taskSummaryRepository = new TaskSummaryRepository(issueRepository);
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
      setup(config.taskRootIssueNumber, rootIssue.body, taskSummaryRepository, taskNoteRepository, issueRepository);
    });
  });
})();

function getExpandList(list) {
  var result = [];
  list.forEach(function (v) {
    result.push(v);

    if (v.status == 'opened') {
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

  return findParent(obj.children[obj.children.length - 1], nest - 1);
}

function parse(text, taskSummaryRepository, taskNoteRepository) {
  var rootObj = {
    title: '_root',
    children: [],
    status: 'opened',
    isTask: false,
    summary: null,
    notes: null,
    latestNote: null,
    latestNoteText: ''
  };
  var lastObj = rootObj;
  var parentObj = rootObj;
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
      summary: null,
      notes: null,
      latestNote: null,
      latestNoteText: ''
    };

    if (obj.issueNumber > 0) {
      obj.summary = taskSummaryRepository.getSummary(obj.issueNumber);
      obj.notes = taskNoteRepository.getNotes(obj.issueNumber);
      obj.latestNote = obj.notes[0];
      obj.latestNoteText = obj.notes.length > 0 ? (obj.notes[0].date + "\n" + obj.notes[0].body).split('\n').join('<br>') : '';
    } // console.log(nest, line);


    if (lastNest == nest) {}

    if (lastNest < nest) {
      parentObj = lastObj;
    }

    if (lastNest > nest) {
      parentObj = findParent(rootObj, nest);
    } // console.log(parentObj);


    parentObj.isTask = false;
    parentObj.children.push(obj);
    lastObj = obj;
    lastNest = nest;
  }); // console.log(rootObj.children);

  return rootObj.children;
}

function setup(taskRootIssueNumber, rootBody, taskSummaryRepository, taskNoteRepository, issueRepository) {
  console.log('rootBody', rootBody);
  var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!',
      list: parse(rootBody, taskSummaryRepository, taskNoteRepository),
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
        this.list = parse(this.rootBody, taskSummaryRepository, taskNoteRepository);
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
      createTask: function createTask(obj) {
        var _this = this;

        taskSummaryRepository.create(obj.title, function (err, issueNumber) {
          if (err) {
            alert(err);
            throw err;
          }

          console.log(obj);
          _this.rootBody = _this.rootBody.split(obj.title).join("[" + obj.title + "](" + _this.issueUrlPrefix + "/" + issueNumber + ")");

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
},{"./infra/github/IssueRepositoryImpl":"infra/github/IssueRepositoryImpl.ts","./infra/github/IssueRepositoryDummy":"infra/github/IssueRepositoryDummy.ts","./infra/github/CommentRepositoryImpl":"infra/github/CommentRepositoryImpl.ts","./infra/github/CommentRepositoryDummy":"infra/github/CommentRepositoryDummy.ts"}],"../../../../../../usr/local/lib/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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