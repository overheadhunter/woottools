woottools
=========

[Download latest yuicompressed woot.js](woot/woot.js)

Lean mootools-based framework for hashbang-routing and JSON-based DOM definitions.
_Important:_ woottools is in a very early stage of development and the API may be subject to change.

## Quickstart

### Configuration

Include dependencies (see woot.js for details) and a your woot configuration file:
``` html
<script type="text/javascript" src="js/lib/mootools-core-1.4.5.js"></script>
<script type="text/javascript" src="js/lib/mootools-more-1.4.0.1.js"></script>
<script type="text/javascript" src="js/woot/woot.js"></script>
<script type="text/javascript" src="js/wootConfig.js"></script>
```

Configure your modules:
``` javascript
woot.modulePaths = {
  "home": "js/modules/home.js",
  "search": "js/modules/search.js",
  "echo": "js/modules/echo.js"
};
```

Configure routes:
``` javascript
woot.routes = {
  "/home": function(routingContext) {
    woot.loadModule("home").replaceDom($('siteContent'));
  },

  "/search/q:[0-9a-z]": function(routingContext) {
    woot.loadModule("search").replaceDom($('siteContent'), routingContext);
  },

  "/echo": function(routingContext) {
    woot.loadModule("echo").replaceDom($('siteContent'));
  }

};
```

Now the following will happen:
* if you navigate to `#!/home` js/modules/home.js gets executed
* if you navigate to `#!/search/q:example` js/modules/search.js gets executed with the parameter q set.
* if you navigate to `#!/echo` js/modules/echo.js gets executed

### Writing Modules

The basic module simply returns a [JsonML](http://jsonml.org)-encoded DOM:
``` javascript
woot.createModule({
  moduleName: "home",

  getDomDefinition: function() {
    return ['div',
      ['h2', 'home'],
      ['p', 'this is a very basic module, that only contains a simple JsonML-encoded DOM tree.']
    ];
  }
});
```

If you want to hook up event handlers:
``` javascript
woot.createModule({
  moduleName: "echo",

  doEcho: function(event) {
    // do stuff
  },

  getDomDefinition: function() {
    return ['div',
      ['form',
        ['input', {'type': 'button', 'events': {'click': this.doEcho}, 'value': 'echo!'}],
      ]
    ];
  }
});
```

If you want to access path parameters:
``` javascript
woot.createModule({
  moduleName: "search",

  onDomReady: function() {
    this.dom.getFirst('#query').set('text', 'You have searched for: ' + this.routingContext.q);
  },

  getDomDefinition: function() {
    return ['div',
      ['h2', 'search'],
      ['p', 'this example shows how to use path parameters. Try changing it in the URL.'],
      ['p', {'id': 'query'}]
    ];
  }
});
```

### Implementing custom executors for loaded modules

Take a look at [moduleExecutors.js](woot/woot/21_moduleExecutors.js):
``` javascript
woot.createModuleExecutor({
  /**
   * Unique name of this executor.
   * Should have a "method name flavour", as this executor will become available as
   * a method of LoadedModule (so you can use
   * woot.loadModule("someModule").executorName(param1, param2, ...).
   *
   * @property executorName
   * @type {String}
   */
  executorName: 'replaceDom',

  /*
   * @param {Object} module A module, whose DOM will be injected into domParentNode.
   * @param {Element} domParentNode The DOM node, whose content should be replaced.
   * @param {Object} routingContext Optional routingContext for the module.
   */
  execute: function(module, domParentNode, routingContext) {
    if (routingContext) {
      module.routingContext = routingContext;
    }
    domParentNode.empty();
    domParentNode.grab(module.getDom());
    module.onDomReady();
  }
});
```

## Compatibility

Currently I can say, that it works well in current versions of Chrome, Safari and Firefox as well as MSIE 8+.
woottools depends on hashchange events. For browsers, that don't [support hashchange events](http://caniuse.com/hashchange),
this mootools extension solves it by polling `location.hash`: http://mootools.net/forge/p/mootools_onhashchange_event

A detailed compatibility list will appear here soon.


## License

Distributed under the MIT license. See the LICENSE file for more info.
