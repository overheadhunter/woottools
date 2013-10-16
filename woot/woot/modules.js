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
	moduleCache: {},
	modulePaths: {},
	moduleExecutorCache: {},
	
	initialize: function(modulePaths) {
		this.modulePaths = modulePaths;
	},
	
	getModule: function(moduleName, moduleExecutionConfig) {
		var path = this.modulePaths[moduleName];
		if (!path) {
			throw new Error("unknown module " + moduleName);
		}
		var module = this.getCachedModule(moduleName);
		if(module) {
			this.executeModule(module, moduleExecutionConfig);
		} else {
			var moduleLoaded = function() {
				var module = woot.moduleCache.getCachedModule(moduleName);
				woot.moduleCache.executeModule(module, moduleExecutionConfig);
			};
			Asset.javascript(path.appendQueryString('ts', new Date().getTime()), {
			    onLoad: moduleLoaded
			});
		}
	},
	
	getCachedModule: function(moduleName) {
		var module = this.moduleCache[moduleName];
		if(instanceOf(module, woot.Module)) {
			return module;
		} else {
			return null;
		}
	},
	
	registerModule: function(module) {
		this.moduleCache[module.moduleName] = module;
	},
	
	executeModule: function(module, moduleExecutionConfig) {
		var executorName = moduleExecutionConfig.executor;
		var executor = this.getModuleExecutor(executorName);
		if (executor) {
			executor.execute(module, moduleExecutionConfig);
		}
	},
	
	getModuleExecutor: function(executorName) {
		var executor = this.moduleExecutorCache[executorName];
		if(instanceOf(executor, woot.ModuleExecutor)) {
			return executor;
		} else {
			return null;
		}
	},
	
	registerModuleExecutor: function(executor) {
		this.moduleExecutorCache[executor.executorName] = executor;
	}
});


/*
 * Modules itself:
 */
woot.Module = new Class({
	moduleName: null,
	dom: null,
	routingContext: {},

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
		throw new Error("your module definition needs a property 'moduleName': " + definition);
	}
	if (definition.Extends) {
		throw new Error("modules must not define a property 'Extends'");
	}
	var classDefinition = Object.merge({Extends: woot.Module}, definition);
	var clazz = new Class(classDefinition);
	var instance = new clazz();
	woot.moduleCache.registerModule(instance);
};


/*
 * Module executor:
 * Instances of this class are executed, whenever a module is loaded from the cache.
 * The module executor should at least prepare the DOM of a module.
 */
woot.ModuleExecutor = new Class({
	executorName: null,
	
	execute: function(module, moduleExecutionConfig) {
		module.prepareDom();
		console.log('Executing module "' + module.moduleName + '" with executor "' + this.executorName + '"');
	}
});

/*
 * Module executor factory:
 */
woot.createModuleExecutor = function(definition) {
	if (!definition.executorName) {
		throw new Error("your module executor definition needs a property 'executorName': " + definition);
	}
	if (definition.Extends) {
		throw new Error("module executors must not define a property 'Extends'");
	}
	var classDefinition = Object.merge({Extends: woot.ModuleExecutor}, definition);
	var clazz = new Class(classDefinition);
	var instance = new clazz();
	woot.moduleCache.registerModuleExecutor(instance);
};