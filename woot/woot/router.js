/* Routing nodes */

woot.PathNode = new Class({
	pathComponent: null,
	nodes: {},
	handler: null,
	
	initialize: function(pathComponent) {
		this.pathComponent = pathComponent;
	},
	
	add: function(pathComponents, handler) {
		var firstComp = pathComponents.shift();
		var node = this.getOrCreateNode(firstComp);
		if (pathComponents.length > 0) {
			// node has further subnodes
			node.add(pathComponents, handler);
		} else {
			// node is leaf
			node.handler = handler;
		}
	},
	
	getOrCreateNode: function(pathComponent) {
		if (!this.nodes[pathComponent]) {
			this.nodes[pathComponent] = woot.nodeFactory.createNode(pathComponent);
		}
		return this.nodes[pathComponent];
	},
	
	traverse: function(pathComponents, routingContext) {
		var currentPathComponent = pathComponents.shift();
		var nextPathComponent = pathComponents[0];
		if (nextPathComponent) {
			var nextNode = this.getFirstMatchingNode(nextPathComponent);
			if (nextNode) {
				nextNode.traverse(pathComponents, routingContext);
			}
		} else {
			this.handler(routingContext);
		}
	},
	
	getFirstMatchingNode: function(nextPathComponent) {
		var matchingNode = null;
		Object.some(this.nodes, function(node) {
			if (node.isMatching(nextPathComponent)) {
				matchingNode = node;
				return true;
			} else {
				return false;
			}
		});
		return matchingNode;
	},
	
	isMatching: function(pathComponent) {
		return false;
	}
	
});

woot.RootPathNode = new Class({
	Extends: woot.PathNode,
	
	traverse: function(pathComponents, routingContext) {
		pathComponents.unshift("");
		this.parent(pathComponents, routingContext);
	}
});

woot.StrictStringPathNode = new Class({
	Extends: woot.PathNode,
	
	isMatching: function(pathComponent) {
		return this.pathComponent == pathComponent;
	}
});

woot.ParamPathNode = new Class({
	Extends: woot.PathNode,
	paramName: null,
	paramPattern: null,
	
	initialize: function(pathComponent) {
		this.parent(pathComponent);
		var firstColon = pathComponent.indexOf(':');
		this.paramName = pathComponent.substr(0, firstColon);
		this.paramPattern = pathComponent.substr(firstColon+1);
	},
	
	isMatching: function(pathComponent) {
		var firstColon = pathComponent.indexOf(':');
		var paramName = pathComponent.substr(0, firstColon);
		var paramValue = pathComponent.substr(firstColon+1);
		return this.paramName == paramName && paramValue.match(this.paramPattern) != null;
	},
	
	traverse: function(pathComponents, routingContext) {
		var pathComponent = pathComponents[0];
		var firstColon = pathComponent.indexOf(':');
		var paramName = pathComponent.substr(0, firstColon);
		var paramValue = pathComponent.substr(firstColon+1);
		routingContext[paramName] = paramValue;
		this.parent(pathComponents, routingContext);
	}
});

woot.nodeFactory = {
	createNode: function(pathComponent) {
		if (pathComponent.indexOf(':') == -1) {
			return new woot.StrictStringPathNode(pathComponent);
		} else {
			return new woot.ParamPathNode(pathComponent);
		}
	}
};

woot.Router = new Class({
	rootRoutingNode: null,
	routingCount: 0,
	
	initialize: function(routes) {
		this.rootRoutingNode = new woot.RootPathNode();
		Object.each(routes, function(handler, route) {
			var pathComponents =  route.pathComponents();
			this.rootRoutingNode.add(pathComponents, handler);

		}, this);
		Element.NativeEvents.hashchange = 2;
		window.addEvent("hashchange", this.route.bind(this));
		window.addEvent("load", this.pageload.bind(this));
	},
	
	pageload: function() {
		// only route on pageload, if not already routed by hashchange polling event:
		if (this.routingCount == 0) {
			this.route();
		}
	},
	
	route: function() {
		var hash = window.location.hash;
		if (hash.startsWith('#!')) {
			var path = window.location.hash.substring(2);
			var pathComponents =  path.pathComponents();
			var routingContext = {};
			this.rootRoutingNode.traverse(pathComponents, routingContext);
		}
		this.routingCount++;
	}
	
});

window.addEvent('domready', function() {
	if (woot.routes) {
		woot.router = new woot.Router(woot.routes);
	} else {
		throw Error("woottools configuration invalid. Please define woot.routes!");
	}
});