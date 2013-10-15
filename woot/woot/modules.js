/*
 * Make sure, modulePaths is configured:
 */
if (typeOf(woot.modulePaths) != 'object') {
	throw new Error("please insert the woot configuration before ");
}

/*
 * Loading of modules:
 */
woot.ModuleCache = new Class({
	cache: {},
	modulePaths: {},
	
	initialize: function(modulePaths) {
		this.modulePaths = modulePaths;
	},
	
	getModule: function(moduleName, callback) {
		var path = this.modulePaths[moduleName];
		if (!path) {
			throw new Error("unknown module " + moduleName);
		}
		var module = this.getCachedModule(moduleName);
		if(module) {
			callback(module);
		} else {
			var moduleLoaded = function() {
				var module = woot.moduleCache.getCachedModule(moduleName);
				callback(module);
			};
			moduleLoaded.bind(this);
			Asset.javascript(path.appendQueryString('ts', new Date().getTime()), {
			    onLoad: moduleLoaded
			});
		}
	},
	
	getCachedModule: function(moduleName) {
		var module = this.cache[moduleName];
		if(instanceOf(module, woot.Module)) {
			return module;
		} else {
			return null;
		}
	},
	
	addModuleToCache: function(module) {
		this.cache[module.moduleName] = module;
	}
});


/*
 * Modules itself:
 */
woot.Module = new Class({
	dom: null,

	prepareDom: function() {
		this.dom = this.getDom().parseJsonML();
		this.onDomReady();
	},

	onDomReady: function() {},

	getDom: function() {return [];}
});

/*
 * Module factory:
 */
woot.createModule = function(definition) {
	if (!definition.moduleName) {
		throw new Error("your module definition needs a name: " + definition);
	}
	if (definition.Extends) {
		throw new Error("modules must not define a property 'Extends'");
	}
	var classDefinition = Object.merge({Extends: woot.Module}, definition);
	var clazz = new Class(classDefinition);
	var instance = new clazz();
	woot.moduleCache.addModuleToCache(instance);
	instance.prepareDom();
};

