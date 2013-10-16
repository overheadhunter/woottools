woottools
=========

Lean mootools-based framework for hashbang-routing and JSON-based DOM definitions.

## Important

woottools is in a very early stage of development and the API may be subject to change.

## Quickstart

### Configuration

Include dependencies (see woot.js for details) and a your woot configuration file:
``` html
<script type="text/javascript" src="js/lib/mootools-core-1.4.5.js"></script>
<script type="text/javascript" src="js/lib/mootools-more-1.4.0.1.js"></script>
<script type="text/javascript" src="js/woot/woot.js"></script>
<script type="text/javascript" src="js/wootConfig.js"></script>
```

Configure your modules
``` javascript
woot.modulePaths = {
  "home": "js/modules/home.js",
  "search": "js/modules/search.js",
  "echo": "js/modules/echo.js"
};
```

Configure routes
``` javascript
woot.routes = {
  "/home": function(routingContext) {
    woot.moduleCache.getModule("home",
      {'executor': 'replaceDom', 'obj': $('siteContent')}
    );
  },

  "/search/q:[0-9a-z]": function(routingContext) {
    woot.moduleCache.getModule("search",
      {'executor': 'replaceDom', 'obj': $('siteContent'), 'routingContext': routingContext}
    );
  },

  "/echo": function(routingContext) {
    woot.moduleCache.getModule("echo",
      {'executor': 'replaceDom', 'obj': $('siteContent')}
    );
  }
        
};
```

Now the following will happen:
* if you navigate to `#!/home` js/modules/home.js gets executed
* if you navigate to `#!/search/q:example` js/modules/search.js gets executed with the parameter q set.
* if you navigate to `#!/echo` js/modules/echo.js gets executed

### Defining Modules

The basic module simply returns a JsonML-encoded DOM (see http://jsonml.org).
``` javascript
woot.createModule({
  moduleName: "home",

  getDom: function() {
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

  getDom: function() {
    return ['div',
      ['form',
        ['input', {'type': 'button', events: {'click': this.doEcho}, 'value': 'echo!'}],
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

  getDom: function() {
    return ['div',
      ['h2', 'search'],
      ['p', 'this example shows how to use path parameters. Try changing it in the URL.'],
      ['p', {'id': 'query'}]
    ];
  }
});
```

## License

Distributed under the CC BY 3.0 license. See the LICENSE file for more info.
