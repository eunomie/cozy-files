(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("application", function(exports, require, module) {
var FileCollection, FolderCollection;

FolderCollection = require('./collections/folder');

FileCollection = require('./collections/file');

module.exports = {
  initialize: function() {
    var Router;
    Router = require('router');
    this.router = new Router();
    this.folders = new FolderCollection();
    this.files = new FileCollection();
    Backbone.history.start();
    if (typeof Object.freeze === 'function') {
      return Object.freeze(this);
    }
  }
};

});

;require.register("collections/file", function(exports, require, module) {
var File, FileCollection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

File = require('../models/file');

module.exports = FileCollection = (function(_super) {
  __extends(FileCollection, _super);

  function FileCollection() {
    _ref = FileCollection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  FileCollection.prototype.model = File;

  FileCollection.prototype.url = 'files';

  FileCollection.prototype.sync = function(method, model, options) {
    var progress;
    progress = function(e) {
      return model.trigger('progress', e);
    };
    _.extend(options, {
      xhr: function() {
        var xhr;
        xhr = $.ajaxSettings.xhr();
        if (xhr instanceof window.XMLHttpRequest) {
          xhr.addEventListener('progress', progress, false);
        }
        if (xhr.upload) {
          xhr.upload.addEventListener('progress', progress, false);
        }
        return xhr;
      }
    });
    return Backbone.sync.apply(this, arguments);
  };

  return FileCollection;

})(Backbone.Collection);

});

;require.register("collections/folder", function(exports, require, module) {
var Folder, FolderCollection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Folder = require('../models/folder');

module.exports = FolderCollection = (function(_super) {
  __extends(FolderCollection, _super);

  function FolderCollection() {
    _ref = FolderCollection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  FolderCollection.prototype.model = Folder;

  FolderCollection.prototype.url = 'folders';

  return FolderCollection;

})(Backbone.Collection);

});

;require.register("helpers/client", function(exports, require, module) {
exports.request = function(type, url, data, callbacks) {
  return $.ajax({
    type: type,
    url: url,
    data: data,
    success: callbacks.success,
    error: callbacks.error
  });
};

exports.get = function(url, callbacks) {
  return exports.request("GET", url, null, callbacks);
};

exports.post = function(url, data, callbacks) {
  return exports.request("POST", url, data, callbacks);
};

exports.put = function(url, data, callbacks) {
  return exports.request("PUT", url, data, callbacks);
};

exports.del = function(url, callbacks) {
  return exports.request("DELETE", url, null, callbacks);
};

});

;require.register("initialize", function(exports, require, module) {
var app;

app = require('application');

$(function() {
  jQuery.event.props.push('dataTransfer');
  app.initialize();
  return $.fn.spin = function(opts, color) {
    var nullapp, presets;
    presets = {
      tiny: {
        lines: 8,
        length: 2,
        width: 2,
        radius: 3
      },
      small: {
        lines: 8,
        length: 1,
        width: 2,
        radius: 5
      },
      large: {
        lines: 10,
        length: 8,
        width: 4,
        radius: 8
      }
    };
    if (Spinner) {
      return this.each(function() {
        var $this, spinner;
        $this = $(this);
        spinner = $this.data("spinner");
        if (spinner != null) {
          spinner.stop();
          return $this.data("spinner", null);
        } else if (opts !== false) {
          if (typeof opts === "string") {
            if (opts in presets) {
              opts = presets[opts];
            } else {
              opts = {};
            }
            if (color) {
              opts.color = color;
            }
          }
          spinner = new Spinner($.extend({
            color: $this.css("color")
          }, opts));
          spinner.spin(this);
          return $this.data("spinner", spinner);
        }
      });
    } else {
      console.log("Spinner class not available.");
      return nullapp = require('application');
    }
  };
});

});

;require.register("lib/app_helpers", function(exports, require, module) {
(function() {
  return (function() {
    var console, dummy, method, methods, _results;
    console = window.console = window.console || {};
    method = void 0;
    dummy = function() {};
    methods = 'assert,count,debug,dir,dirxml,error,exception,\
                   group,groupCollapsed,groupEnd,info,log,markTimeline,\
                   profile,profileEnd,time,timeEnd,trace,warn'.split(',');
    _results = [];
    while (method = methods.pop()) {
      _results.push(console[method] = console[method] || dummy);
    }
    return _results;
  })();
})();

});

;require.register("lib/base_view", function(exports, require, module) {
var BaseView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = BaseView = (function(_super) {
  __extends(BaseView, _super);

  function BaseView() {
    _ref = BaseView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  BaseView.prototype.template = function() {};

  BaseView.prototype.initialize = function() {};

  BaseView.prototype.getRenderData = function() {
    var _ref1;
    return {
      model: (_ref1 = this.model) != null ? _ref1.toJSON() : void 0
    };
  };

  BaseView.prototype.render = function() {
    this.beforeRender();
    this.$el.html(this.template(this.getRenderData()));
    this.afterRender();
    return this;
  };

  BaseView.prototype.beforeRender = function() {};

  BaseView.prototype.afterRender = function() {};

  BaseView.prototype.destroy = function() {
    this.undelegateEvents();
    this.$el.removeData().unbind();
    this.remove();
    return Backbone.View.prototype.remove.call(this);
  };

  return BaseView;

})(Backbone.View);

});

;require.register("lib/view_collection", function(exports, require, module) {
var BaseView, ViewCollection, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('lib/base_view');

module.exports = ViewCollection = (function(_super) {
  __extends(ViewCollection, _super);

  function ViewCollection() {
    this.removeItem = __bind(this.removeItem, this);
    this.addItem = __bind(this.addItem, this);
    _ref = ViewCollection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ViewCollection.prototype.itemview = null;

  ViewCollection.prototype.views = {};

  ViewCollection.prototype.template = function() {
    return '';
  };

  ViewCollection.prototype.itemViewOptions = function() {};

  ViewCollection.prototype.collectionEl = null;

  ViewCollection.prototype.onChange = function() {
    return this.$el.toggleClass('empty', _.size(this.views) === 0);
  };

  ViewCollection.prototype.appendView = function(view) {
    return this.$collectionEl.append(view.el);
  };

  ViewCollection.prototype.initialize = function() {
    var collectionEl;
    ViewCollection.__super__.initialize.apply(this, arguments);
    this.views = {};
    this.listenTo(this.collection, "reset", this.onReset);
    this.listenTo(this.collection, "add", this.addItem);
    this.listenTo(this.collection, "remove", this.removeItem);
    if (this.collectionEl == null) {
      return collectionEl = el;
    }
  };

  ViewCollection.prototype.render = function() {
    var id, view, _ref1;
    _ref1 = this.views;
    for (id in _ref1) {
      view = _ref1[id];
      view.$el.detach();
    }
    return ViewCollection.__super__.render.apply(this, arguments);
  };

  ViewCollection.prototype.afterRender = function() {
    var id, view, _ref1;
    this.$collectionEl = $(this.collectionEl);
    _ref1 = this.views;
    for (id in _ref1) {
      view = _ref1[id];
      this.appendView(view.$el);
    }
    this.onReset(this.collection);
    return this.onChange(this.views);
  };

  ViewCollection.prototype.remove = function() {
    this.onReset([]);
    return ViewCollection.__super__.remove.apply(this, arguments);
  };

  ViewCollection.prototype.onReset = function(newcollection) {
    var id, view, _ref1;
    _ref1 = this.views;
    for (id in _ref1) {
      view = _ref1[id];
      view.remove();
    }
    return newcollection.forEach(this.addItem);
  };

  ViewCollection.prototype.addItem = function(model) {
    var options, view;
    options = _.extend({}, {
      model: model
    }, this.itemViewOptions(model));
    view = new this.itemview(options);
    this.views[model.cid] = view.render();
    this.appendView(view);
    return this.onChange(this.views);
  };

  ViewCollection.prototype.removeItem = function(model) {
    this.views[model.cid].remove();
    delete this.views[model.cid];
    return this.onChange(this.views);
  };

  return ViewCollection;

})(BaseView);

});

;require.register("models/file", function(exports, require, module) {
var Bookmark, client, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

client = require("../helpers/client");

module.exports = Bookmark = (function(_super) {
  __extends(Bookmark, _super);

  function Bookmark() {
    _ref = Bookmark.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Bookmark.prototype.rootUrl = 'files/';

  Bookmark.prototype.prepareCallbacks = function(callbacks, presuccess, preerror) {
    var error, success, _ref1,
      _this = this;
    _ref1 = callbacks || {}, success = _ref1.success, error = _ref1.error;
    if (presuccess == null) {
      presuccess = function(data) {
        return _this.set(data.app);
      };
    }
    this.trigger('request', this, null, callbacks);
    callbacks.success = function(data) {
      if (presuccess) {
        presuccess(data);
      }
      _this.trigger('sync', _this, null, callbacks);
      if (success) {
        return success(data);
      }
    };
    return callbacks.error = function(jqXHR) {
      if (preerror) {
        preerror(jqXHR);
      }
      _this.trigger('error', _this, jqXHR, {});
      if (error) {
        return error(jqXHR);
      }
    };
  };

  Bookmark.prototype.getAttachment = function(file, callbacks) {
    this.prepareCallbacks(callbacks);
    return client.post("files/" + this.id + "/getAttachment/" + this.name, callbacks);
  };

  return Bookmark;

})(Backbone.Model);

});

;require.register("models/folder", function(exports, require, module) {
var Bookmark, client, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

client = require("../helpers/client");

module.exports = Bookmark = (function(_super) {
  __extends(Bookmark, _super);

  function Bookmark() {
    _ref = Bookmark.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Bookmark.prototype.rootUrl = 'folders/';

  Bookmark.prototype.validate = function(attrs, options) {
    var errors;
    errors = [];
    if (!attrs.name || attrs.name === "") {
      errors.push({
        field: 'name',
        value: "A name must be set."
      });
    }
    if (errors.length > 0) {
      return errors;
    }
  };

  Bookmark.prototype.prepareCallbacks = function(callbacks, presuccess, preerror) {
    var error, success, _ref1,
      _this = this;
    _ref1 = callbacks || {}, success = _ref1.success, error = _ref1.error;
    if (presuccess == null) {
      presuccess = function(data) {
        return _this.set(data.app);
      };
    }
    this.trigger('request', this, null, callbacks);
    callbacks.success = function(data) {
      if (presuccess) {
        presuccess(data);
      }
      _this.trigger('sync', _this, null, callbacks);
      if (success) {
        return success(data);
      }
    };
    return callbacks.error = function(jqXHR) {
      if (preerror) {
        preerror(jqXHR);
      }
      _this.trigger('error', _this, jqXHR, {});
      if (error) {
        return error(jqXHR);
      }
    };
  };

  Bookmark.prototype.get = function(callbacks) {
    this.prepareCallbacks(callbacks);
    return client.get("folders/" + this.id, callbacks);
  };

  Bookmark.prototype.findFiles = function(callbacks) {
    this.prepareCallbacks(callbacks);
    return client.get("folders/" + this.id + "/files", callbacks);
  };

  Bookmark.prototype.findFolders = function(callbacks) {
    this.prepareCallbacks(callbacks);
    return client.get("folders/" + this.id + "/folders", callbacks);
  };

  return Bookmark;

})(Backbone.Model);

});

;require.register("router", function(exports, require, module) {
var Folder, FolderView, MockupView, Router, app, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

app = require('application');

FolderView = require('views/folder');

Folder = require('models/folder');

MockupView = require('views/mockup');

module.exports = Router = (function(_super) {
  __extends(Router, _super);

  function Router() {
    this.displayView = __bind(this.displayView, this);
    _ref = Router.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Router.prototype.routes = {
    '': 'mockup',
    'folders/:folderid': 'folder',
    'mockup': 'mockup'
  };

  Router.prototype.main = function() {
    var folder;
    folder = new Folder({
      id: "root",
      path: "",
      name: ""
    });
    return this.displayView(new FolderView({
      model: folder
    }));
  };

  Router.prototype.folder = function(id) {
    var folder, initView,
      _this = this;
    initView = function(folder) {
      return _this.displayView(new FolderView({
        model: folder
      }));
    };
    if (app.folders.get(id)) {
      folder = app.folders.get(id);
      return initView(folder);
    } else {
      folder = new Folder({
        id: id
      });
      return folder.get({
        success: function(data) {
          folder.set(data);
          return initView(folder);
        }
      });
    }
  };

  Router.prototype.displayView = function(view) {
    var el;
    if (this.mainView) {
      this.mainView.remove();
    }
    this.mainView = view;
    el = this.mainView.render().$el;
    return $('body').append(el);
  };

  Router.prototype.mockup = function() {
    if (this.mainView) {
      this.mainView.remove();
    }
    this.mainView = new MockupView();
    return this.mainView.render();
  };

  return Router;

})(Backbone.Router);

});

;require.register("views/fileslist", function(exports, require, module) {
var BaseView, File, FileView, FilesListView, ViewCollection, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('../lib/base_view');

FileView = require('./fileslist_item');

BaseView = require('../lib/base_view');

FileView = require('./fileslist_item');

File = require('../models/file');

ViewCollection = require('../lib/view_collection');

module.exports = FilesListView = (function(_super) {
  __extends(FilesListView, _super);

  function FilesListView() {
    this.upload = __bind(this.upload, this);
    this.addFile = __bind(this.addFile, this);
    _ref = FilesListView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  FilesListView.prototype.template = require('./templates/fileslist');

  FilesListView.prototype.itemview = FileView;

  FilesListView.prototype.collectionEl = '#file-list';

  FilesListView.views = {};

  FilesListView.prototype.initialize = function(data) {
    FilesListView.__super__.initialize.apply(this, arguments);
    return this.repository = data.repository;
  };

  FilesListView.prototype.afterRender = function() {
    return FilesListView.__super__.afterRender.call(this);
  };

  FilesListView.prototype.addFile = function(attach) {
    var file, fileAttributes;
    fileAttributes = {
      name: attach.name,
      path: this.repository
    };
    file = new File(fileAttributes);
    file.file = attach;
    this.collection.add(file);
    return this.upload(file);
  };

  FilesListView.prototype.upload = function(file) {
    var formdata,
      _this = this;
    formdata = new FormData();
    formdata.append('cid', file.cid);
    formdata.append('name', file.get('name'));
    formdata.append('path', file.get('path'));
    formdata.append('file', file.file);
    return Backbone.sync('create', file, {
      contentType: false,
      data: formdata,
      success: function(data) {
        return file.set(data);
      }
    });
  };

  return FilesListView;

})(ViewCollection);

});

;require.register("views/fileslist_item", function(exports, require, module) {
var BaseView, FileListsItemView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('../lib/base_view');

module.exports = FileListsItemView = (function(_super) {
  __extends(FileListsItemView, _super);

  function FileListsItemView() {
    _ref = FileListsItemView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  FileListsItemView.prototype.className = 'file';

  FileListsItemView.prototype.tagName = 'div';

  FileListsItemView.prototype.template = require('./templates/fileslist_item');

  FileListsItemView.prototype.events = {
    'click button.delete': 'onDeleteClicked'
  };

  FileListsItemView.prototype.initialize = function() {
    var _this = this;
    return this.listenTo(this.model, 'change:id', function() {
      return _this.render();
    });
  };

  FileListsItemView.prototype.onDeleteClicked = function() {
    if (confirm('Are you sure ?')) {
      this.$('button.delete').html("deleting...");
      return this.model.destroy({
        error: function() {
          alert("Server error occured, file was not deleted.");
          return this.$('button.delete').html("delete");
        }
      });
    }
  };

  return FileListsItemView;

})(BaseView);

});

;require.register("views/folder", function(exports, require, module) {
var AppView, BaseView, FileCollection, FilesList, Folder, FolderCollection, FoldersList, app, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('../lib/base_view');

FilesList = require('./fileslist');

FileCollection = require('../collections/file');

FolderCollection = require('../collections/folder');

FoldersList = require('./folderslist');

Folder = require('../models/folder');

app = require('application');

module.exports = AppView = (function(_super) {
  __extends(AppView, _super);

  function AppView() {
    this.onAddFile = __bind(this.onAddFile, this);
    this.onAddFolder = __bind(this.onAddFolder, this);
    _ref = AppView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  AppView.prototype.template = require('./templates/folder');

  AppView.prototype.id = 'folder';

  AppView.prototype.className = 'container-fluid';

  AppView.prototype.events = function() {
    return {
      'click .add': 'onAddFolder',
      'change #uploader': 'onAddFile'
    };
  };

  AppView.prototype.afterRender = function() {
    var _this = this;
    AppView.__super__.afterRender.apply(this, arguments);
    this.name = this.$('#name');
    this.uploader = this.$('#uploader')[0];
    this.repository = this.model.attributes.path + '/' + this.model.attributes.name;
    if (this.repository === '/') {
      this.repository = "";
    }
    this.model.findFiles({
      success: function(files) {
        var collection, data;
        app.files.add(files);
        collection = new FileCollection(files);
        data = {
          collection: collection,
          repository: _this.repository
        };
        _this.filesList = new FilesList(data);
        _this.$('#files').append(_this.filesList.$el);
        return _this.filesList.render();
      },
      error: function(error) {
        return console.log(error);
      }
    });
    return this.model.findFolders({
      success: function(folders) {
        var collection, data;
        app.folders.add(folders);
        collection = new FolderCollection(folders);
        data = {
          collection: collection,
          repository: _this.repository
        };
        _this.foldersList = new FoldersList(data);
        _this.$('#folders').append(_this.foldersList.$el);
        return _this.foldersList.render();
      },
      error: function(error) {
        return console.log(error);
      }
    });
  };

  AppView.prototype.onAddFolder = function() {
    var err, folder;
    folder = {
      name: this.name.val(),
      path: this.repository
    };
    folder = new Folder(folder);
    err = folder.validate(folder.attributes);
    if (err) {
      return alert("The folder name is empty");
    } else {
      return this.foldersList.onAddFolder(folder.attributes);
    }
  };

  AppView.prototype.onAddFile = function() {
    var attach, _i, _len, _ref1, _results;
    _ref1 = this.uploader.files;
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      attach = _ref1[_i];
      _results.push(this.filesList.addFile(attach));
    }
    return _results;
  };

  return AppView;

})(BaseView);

});

;require.register("views/folderslist", function(exports, require, module) {
var BaseView, FileView, FilesListView, Folder, FolderView, ViewCollection, app, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('../lib/base_view');

FileView = require('./fileslist_item');

BaseView = require('../lib/base_view');

FolderView = require('./folderslist_item');

Folder = require('../models/folder');

ViewCollection = require('../lib/view_collection');

app = require('application');

module.exports = FilesListView = (function(_super) {
  __extends(FilesListView, _super);

  function FilesListView() {
    _ref = FilesListView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  FilesListView.prototype.template = require('./templates/folderslist');

  FilesListView.prototype.itemview = FolderView;

  FilesListView.prototype.collectionEl = '#folder-list';

  FilesListView.views = {};

  FilesListView.prototype.initialize = function(data) {
    FilesListView.__super__.initialize.apply(this, arguments);
    this.repository = "";
    if (data.repository != null) {
      return this.repository = data.repository;
    }
  };

  FilesListView.prototype.afterRender = function() {
    FilesListView.__super__.afterRender.apply(this, arguments);
    return this.name = this.$('#name');
  };

  FilesListView.prototype.onAddFolder = function(folder) {
    var _this = this;
    return this.collection.create(folder, {
      success: function(data) {
        return app.folders.add(data);
      },
      error: function(error) {
        _this.collection.reset(folder);
        return alert(error.msg);
      }
    });
  };

  return FilesListView;

})(ViewCollection);

});

;require.register("views/folderslist_item", function(exports, require, module) {
var BaseView, FolderListsItemView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('../lib/base_view');

module.exports = FolderListsItemView = (function(_super) {
  __extends(FolderListsItemView, _super);

  function FolderListsItemView() {
    _ref = FolderListsItemView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  FolderListsItemView.prototype.className = 'folder';

  FolderListsItemView.prototype.tagName = 'div';

  FolderListsItemView.prototype.template = require('./templates/folderslist_item');

  FolderListsItemView.prototype.events = function() {
    return {
      'click button.delete': 'onDeleteClicked',
      'click .show-button': 'onShowClicked'
    };
  };

  FolderListsItemView.prototype.initialize = function() {
    var _this = this;
    FolderListsItemView.__super__.initialize.apply(this, arguments);
    this.listenTo(this.model, 'change:id', function() {
      return _this.render();
    });
    return this.listenTo(this.model, 'change:name', function() {
      return _this.render();
    });
  };

  FolderListsItemView.prototype.onDeleteClicked = function() {
    if (confirm('Are you sure ?')) {
      return this.model.destroy({
        error: function() {
          return alert("Server error occured, folder was not deleted.");
        }
      });
    }
  };

  return FolderListsItemView;

})(BaseView);

});

;require.register("views/mockup", function(exports, require, module) {
var BaseView, MockupView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('../lib/base_view');

module.exports = MockupView = (function(_super) {
  __extends(MockupView, _super);

  function MockupView() {
    _ref = MockupView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  MockupView.prototype.template = require('./templates/mockup');

  MockupView.prototype.el = "body";

  return MockupView;

})(BaseView);

});

;require.register("views/templates/fileslist", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="file-list"></div>');
}
return buf.join("");
};
});

;require.register("views/templates/fileslist_item", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<i class="icon-file"> </i><a');
buf.push(attrs({ 'href':("files/" + (model.id) + "/attach/" + (model.name) + ""), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('> ' + escape((interp = model.name) == null ? '' : interp) + '  </a><button class="delete"><i class="icon-trash icon-white"> </i></button><a');
buf.push(attrs({ 'href':("files/" + (model.id) + "/download/" + (model.name) + ""), 'download':("" + (model.name) + "") }, {"href":true,"download":true}));
buf.push('> <i class="icon-download icon-white"></i></a>');
}
return buf.join("");
};
});

;require.register("views/templates/folder", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="bar"><input id="uploader" type="file" class="flatbtn"/><input type="text" value="" id="name" placeholder="Folder name" class="input-block-level"/><button class="add flatbtn">Create new folder</button></div><div id="content"><div id="h4">' + escape((interp = model.path + '/' + model.name) == null ? '' : interp) + '</div><div id="folders"></div><div id="files"></div></div>');
}
return buf.join("");
};
});

;require.register("views/templates/folderslist", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="folder-list"></div>');
}
return buf.join("");
};
});

;require.register("views/templates/folderslist_item", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<i class="icon-folder-close"></i><a');
buf.push(attrs({ 'href':("#folders/" + (model.id) + "") }, {"href":true}));
buf.push('> ' + escape((interp = model.name) == null ? '' : interp) + '  </a><button class="delete"><i class="icon-trash icon-white"> </i></button>');
}
return buf.join("");
};
});

;require.register("views/templates/mockup", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="dialog-upload-file" class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" data-dismiss="modal" aria-hidden="true" class="close">×</button><h4 class="modal-title">Upload a new file</h4></div><div class="modal-body"><form><fieldset><div class="form-group"><label for="uploader">Choose the file to upload:</label><input id="uploader" type="file" class="form-control"/></div></fieldset></form></div><div class="modal-footer"><button type="button" data-dismiss="modal" class="btn btn-link">Close</button><button type="button" class="btn btn-cozy-contrast">Send</button></div></div></div></div><div id="dialog-new-folder" class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" data-dismiss="modal" aria-hidden="true" class="close">×</button><h4 class="modal-title">Add a new folder</h4></div><div class="modal-body"><form><fieldset><div class="form-group"><label for="inputName">Enter the folder\'s name: </label><input id="inputName" type="text" class="form-control"/></div></fieldset></form></div><div class="modal-footer"><button type="button" data-dismiss="modal" class="btn btn-link">Close</button><button type="button" class="btn btn-cozy">Send</button></div></div></div></div><div id="affixbar" data-spy="affix" data-offset-top="1"><div class="container"><div class="row"><div class="col-lg-12"><p class="pull-right"><a href="#dialog-upload-file" data-toggle="modal" data-target="#dialog-upload-file" class="btn btn-cozy-contrast"><span class="glyphicon glyphicon-upload"></span> Upload a file to "silly cats"</a> <a href="#dialog-new-folder" data-toggle="modal" data-target="#dialog-new-folder" class="btn btn-cozy"><span class="glyphicon glyphicon-plus-sign"></span> Create a new folder</a></p></div></div></div></div><div class="container"><div class="row content-shadow"><div id="content" class="col-lg-12"><div id="crumbs"><ul><li><a href="#"><span class="glyphicon glyphicon-folder-open"> </span></a></li><li><a href="#">personal</a></li><li><a href="#">photos</a></li><li><a href="#">very long folder name it is indeed</a></li><li><a href="#">another one</a></li><li><a href="#">silly cats</a></li></ul></div><table id="table-items" class="table table-hover"><tbody><tr class="folder-row"><td><span class="glyphicon glyphicon-folder-close"> </span><a class="btn btn-link">little grumpy cat</a><div class="operations"><a><span class="glyphicon glyphicon-remove-circle"> </span></a><a><span class="glyphicon glyphicon-edit"> </span></a><a><span class="glyphicon glyphicon-cloud-download"> </span></a></div></td><td class="operation-title"></td><td class="operation-amount"><span class="pull-right">12:00 12/10/2013</span></td></tr><tr class="folder-row"><td><span class="glyphicon glyphicon-folder-close"> </span><a class="btn btn-link">little grumpy cat</a><div class="operations"><a><span class="glyphicon glyphicon-remove-circle"> </span></a><a><span class="glyphicon glyphicon-edit"> </span></a><a><span class="glyphicon glyphicon-cloud-download"> </span></a></div></td><td class="operation-title"></td><td class="operation-amount"><span class="pull-right">12:00 12/10/2013</span></td></tr><tr class="folder-row"><td><span class="glyphicon glyphicon-folder-close"> </span><a class="btn btn-link">little grumpy cat</a><div class="operations"><a><span class="glyphicon glyphicon-remove-circle"> </span></a><a><span class="glyphicon glyphicon-edit"> </span></a><a><span class="glyphicon glyphicon-cloud-download"> </span></a></div></td><td class="operation-title"></td><td class="operation-amount"><span class="pull-right">12:00 12/10/2013</span></td></tr><tr class="folder-row"><td><span class="glyphicon glyphicon-folder-close"> </span><a class="btn btn-link">little grumpy cat</a><div class="operations"><a><span class="glyphicon glyphicon-remove-circle"> </span></a><a><span class="glyphicon glyphicon-edit"> </span></a><a><span class="glyphicon glyphicon-cloud-download"> </span></a></div></td><td class="operation-title"></td><td class="operation-amount"><span class="pull-right">12:00 12/10/2013</span></td></tr><tr class="folder-row"><td><span class="glyphicon glyphicon-file"> </span><a class="btn btn-link">sweet kitty on a bicycle.jpg</a><div class="operations"><a><span class="glyphicon glyphicon-remove-circle"> </span></a><a><span class="glyphicon glyphicon-edit"> </span></a><a><span class="glyphicon glyphicon-cloud-download"> </span></a></div></td><td class="operation-title"></td><td class="operation-amount"><span class="pull-right">12:00 12/10/2013</span></td></tr><tr class="folder-row"><td><span class="glyphicon glyphicon-file"> </span><a class="btn btn-link">sweet kitty on a bicycle.jpg</a><div class="operations"><a><span class="glyphicon glyphicon-remove-circle"> </span></a><a><span class="glyphicon glyphicon-edit"> </span></a><a><span class="glyphicon glyphicon-cloud-download"> </span></a></div></td><td class="operation-title"></td><td class="operation-amount"><span class="pull-right">12:00 12/10/2013</span></td></tr><tr class="folder-row"><td><span class="glyphicon glyphicon-file"> </span><a class="btn btn-link">sweet kitty on a bicycle.jpg</a><div class="operations"><a><span class="glyphicon glyphicon-remove-circle"> </span></a><a><span class="glyphicon glyphicon-edit"> </span></a><a><span class="glyphicon glyphicon-cloud-download"> </span></a></div></td><td class="operation-title"></td><td class="operation-amount"><span class="pull-right">12:00 12/10/2013</span></td></tr><tr class="folder-row"><td><span class="glyphicon glyphicon-file"> </span><a class="btn btn-link">sweet kitty on a bicycle.jpg</a><div class="operations"><a><span class="glyphicon glyphicon-remove-circle"> </span></a><a><span class="glyphicon glyphicon-edit"> </span></a><a><span class="glyphicon glyphicon-cloud-download"> </span></a></div></td><td class="operation-title"></td><td class="operation-amount"><span class="pull-right">12:00 12/10/2013</span></td></tr><tr class="folder-row"><td><span class="glyphicon glyphicon-file"> </span><a class="btn btn-link">sweet kitty on a bicycle.jpg</a><div class="operations"><a><span class="glyphicon glyphicon-remove-circle"> </span></a><a><span class="glyphicon glyphicon-edit"> </span></a><a><span class="glyphicon glyphicon-cloud-download"> </span></a></div></td><td class="operation-title"></td><td class="operation-amount"><span class="pull-right">12:00 12/10/2013</span></td></tr><tr class="folder-row"><td><span class="glyphicon glyphicon-file"> </span><a class="btn btn-link">sweet kitty on a bicycle.jpg</a><div class="operations"><a><span class="glyphicon glyphicon-remove-circle"> </span></a><a><span class="glyphicon glyphicon-edit"> </span></a><a><span class="glyphicon glyphicon-cloud-download"> </span></a></div></td><td class="operation-title"></td><td class="operation-amount"><span class="pull-right">12:00 12/10/2013</span></td></tr><tr class="folder-row"><td><span class="glyphicon glyphicon-file"> </span><a class="btn btn-link">sweet kitty on a bicycle.jpg</a><div class="operations"><a><span class="glyphicon glyphicon-remove-circle"> </span></a><a><span class="glyphicon glyphicon-edit"> </span></a><a><span class="glyphicon glyphicon-cloud-download"> </span></a></div></td><td class="operation-title"></td><td class="operation-amount"><span class="pull-right">12:00 12/10/2013</span></td></tr><tr class="folder-row"><td><span class="glyphicon glyphicon-file"> </span><a class="btn btn-link">super sweet kitty.jpg</a><div class="operations"><a><span class="glyphicon glyphicon-remove-circle"> </span></a><a><span class="glyphicon glyphicon-edit"> </span></a><a><span class="glyphicon glyphicon-cloud-download"> </span></a></div></td><td class="operation-title"></td><td class="operation-amount"><span class="pull-right">12:00 12/10/2013</span></td></tr><tr class="folder-row"><td><span class="glyphicon glyphicon-file"> </span><a class="btn btn-link">super sweet kitty.jpg</a><div class="operations"><a><span class="glyphicon glyphicon-remove-circle"> </span></a><a><span class="glyphicon glyphicon-edit"> </span></a><a><span class="glyphicon glyphicon-cloud-download"> </span></a></div></td><td class="operation-title"></td><td class="operation-amount"><span class="pull-right">12:00 12/10/2013</span></td></tr><tr class="folder-row"><td><span class="glyphicon glyphicon-file"> </span><a class="btn btn-link">super sweet kitty.jpg</a><div class="operations"><a><span class="glyphicon glyphicon-remove-circle"> </span></a><a><span class="glyphicon glyphicon-edit"> </span></a><a><span class="glyphicon glyphicon-cloud-download"> </span></a></div></td><td class="operation-title"></td><td class="operation-amount"><span class="pull-right">12:00 12/10/2013</span></td></tr><tr class="folder-row"><td><span class="glyphicon glyphicon-file"> </span><a class="btn btn-link">super sweet kitty.jpg</a><div class="operations"><a><span class="glyphicon glyphicon-remove-circle"> </span></a><a><span class="glyphicon glyphicon-edit"> </span></a><a><span class="glyphicon glyphicon-cloud-download"> </span></a></div></td><td class="operation-title"></td><td class="operation-amount"><span class="pull-right">12:00 12/10/2013</span></td></tr><tr class="folder-row"><td><span class="glyphicon glyphicon-file"> </span><a class="btn btn-link">super sweet kitty.jpg</a><div class="operations"><a><span class="glyphicon glyphicon-remove-circle"> </span></a><a><span class="glyphicon glyphicon-edit"> </span></a><a><span class="glyphicon glyphicon-cloud-download"> </span></a></div></td><td class="operation-title"></td><td class="operation-amount"><span class="pull-right">12:00 12/10/2013</span></td></tr><tr class="folder-row"><td><span class="glyphicon glyphicon-file"> </span><a class="btn btn-link">super sweet kitty.jpg</a><div class="operations"><a><span class="glyphicon glyphicon-remove-circle"> </span></a><a><span class="glyphicon glyphicon-edit"> </span></a><a><span class="glyphicon glyphicon-cloud-download"> </span></a></div></td><td class="operation-title"></td><td class="operation-amount"><span class="pull-right">12:00 12/10/2013</span></td></tr><tr class="folder-row"><td><span class="glyphicon glyphicon-file"> </span><a class="btn btn-link">super sweet kitty.jpg</a><div class="operations"><a><span class="glyphicon glyphicon-remove-circle"> </span></a><a><span class="glyphicon glyphicon-edit"> </span></a><a><span class="glyphicon glyphicon-cloud-download"> </span></a></div></td><td class="operation-title"></td><td class="operation-amount"><span class="pull-right">12:00 12/10/2013</span></td></tr><tr class="folder-row"><td><span class="glyphicon glyphicon-file"> </span><a class="btn btn-link">super sweet kitty.jpg</a><div class="operations"><a><span class="glyphicon glyphicon-remove-circle"> </span></a><a><span class="glyphicon glyphicon-edit"> </span></a><a><span class="glyphicon glyphicon-cloud-download"> </span></a></div></td><td class="operation-title"></td><td class="operation-amount"><span class="pull-right">12:00 12/10/2013</span></td></tr><tr class="folder-row"><td><span class="glyphicon glyphicon-file"> </span><a class="btn btn-link">super sweet kitty.jpg</a><div class="operations"><a><span class="glyphicon glyphicon-remove-circle"> </span></a><a><span class="glyphicon glyphicon-edit"> </span></a><a><span class="glyphicon glyphicon-cloud-download"> </span></a></div></td><td class="operation-title"></td><td class="operation-amount"><span class="pull-right">12:00 12/10/2013</span></td></tr><tr class="folder-row"><td><span class="glyphicon glyphicon-file"> </span><a class="btn btn-link">super sweet kitty.jpg</a><div class="operations"><a><span class="glyphicon glyphicon-remove-circle"> </span></a><a><span class="glyphicon glyphicon-edit"> </span></a><a><span class="glyphicon glyphicon-cloud-download"> </span></a></div></td><td class="operation-title"></td><td class="operation-amount"><span class="pull-right">12:00 12/10/2013</span></td></tr><tr class="folder-row"><td><span class="glyphicon glyphicon-file"> </span><a class="btn btn-link">super sweet kitty.jpg</a><div class="operations"><a><span class="glyphicon glyphicon-remove-circle"> </span></a><a><span class="glyphicon glyphicon-edit"> </span></a><a><span class="glyphicon glyphicon-cloud-download"> </span></a></div></td><td class="operation-title"></td><td class="operation-amount"><span class="pull-right">12:00 12/10/2013</span></td></tr></tbody></table></div></div></div>');
}
return buf.join("");
};
});

;require.register("views/templates/uploader", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<input id="uploader" type="file"/>');
}
return buf.join("");
};
});

;
//# sourceMappingURL=app.js.map