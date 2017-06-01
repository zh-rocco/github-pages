/*http://www.cnblogs.com/kuailingmin/p/4208863.html*/

(function () {
  var root = this;
  root.YOURLIB = {
    FUNC1: function () {
    },
    FUNC2: function () {
    }
  }
}.call(this))


(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {

  $.fn.render = function () {
  };
  $.render2 = function () {
  }
}));

/*为了让同一个模块可以运行在前后端，在开发过程中需要考虑兼容前后端问题，以下代码演示如何将hello()方法定义到不同的运行环境中，它能够兼容AMD、CMD、Node以及常见的浏览器环境中*/
/* http://www.css88.com/archives/6360 */
;(function (name, definition) {
  // 检测上下文环境是否为AMD或CMD
  var hasDefine = typeof define === 'function',
    // 检查上下文环境是否为Node
    hasExports = typeof module !== 'undefined' && module.exports;

  if (hasDefine) {
    // AMD环境或CMD环境
    define(definition);
  } else if (hasExports) {
    // 定义为普通Node模块
    module.exports = definition();
  } else {
    // 将模块的执行结果挂在window变量中，在浏览器中this指向window对象
    this[name] = definition();
  }
})('hello', function () {
  var hello = function () {
  };
  return hello;
});

(function (root, factory) {
  var JSLite = factory(root);
  if (typeof define === 'function' && define.amd) {
    // AMD
    // define([], factory);
    define('JSLite', function () {
      return JSLite;
    });
  } else if (typeof exports === 'object') {
    // Node.js
    module.exports = JSLite;
  } else {
    // Browser globals
    root.JSLite = JSLite;
  }
})(this, function () {
  //module ...
});
