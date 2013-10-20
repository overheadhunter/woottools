/**
 * A module contains a JsonML definition of a DOM subtree and logic.
 *
 * @class Module
 */
woot.Module = new Class({
	moduleName: null,
	dom: null,
	routingContext: {},

	onDomReady: function() {},
	
	resetDom: function() {
		this.dom = null;
	},
	
	getDom: function() {
		if (!this.dom) {
			this.dom = this.getDomDefinition().parseJsonML();;
		}
		return this.dom;
	},

	getDomDefinition: function() {return [];}
});

/**
 * Module executor:
 * Instances of this class are executed, whenever a module is loaded from the cache.
 * The module executor should at least prepare the DOM of a module.
 *
 * @class ModuleExecutor
 */
woot.ModuleExecutor = new Class({
	executorName: null,
	
	execute: function(module) {
		// to be overwritten
		console.log('Executing module "' + module.moduleName + '" with executor "' + this.executorName + '"');
	}
});

/**
 * A LoadedModule will be returned by the moduleCache, when asked for a module.
 * A LoadedModule has a reference to the loaded Module (of course) and implements
 * one function for each registered ModuleExecutor.
 *
 * @class LoadedModule
 */
woot.LoadedModule = new Class({
	module: null,
	executeImmediately: false,
	executionParameters: null,
	executor: null,
	
	/**
	 * @constructor
	 */
	initialize: function(module, executeImmediately) {
		this.module = module;
		this.executeImmediately = executeImmediately;
	},
	
	/**
	 * Executes the execute method of the executionParameter associated with this LoadedModule.
	 * The arguments of this method call are 
	 */
	execute: function() {
		if (instanceOf(this.executor, woot.ModuleExecutor)) {
			this.executionParameters.unshift(this.module);
			// bind method, pass params and run:
			var exectue = this.executor.execute.pass(this.executionParameters, this.executor);
			exectue();
		}
	}
	
});

/**
 * Singleton object containing references to all registered modules.
 */
woot.moduleCache = {
	cachedModules: {},
	
	/*
	 * @return a LoadedModule instance
	 */
	getModule: function(moduleName) {
		var path = woot.modulePaths[moduleName];
		if (!path) {
			throw new Error("unknown module " + moduleName);
		}
		var module = this.getCachedModule(moduleName);
		if(module) {
			return new woot.LoadedModule(module, true);
			this.executeModule(module, moduleExecutionConfig);
		} else {
			var loadedModuleWithDelayedExecution = new woot.LoadedModule(null, false);
			Asset.javascript(path.appendQueryString('ts', new Date().getTime()), {
			    onLoad: function() {
			    	loadedModuleWithDelayedExecution.module = woot.moduleCache.getCachedModule(moduleName);
			    	var execute = loadedModuleWithDelayedExecution.execute.bind(loadedModuleWithDelayedExecution);
			    	execute();
			    }
			});
			return loadedModuleWithDelayedExecution;
		}
	},
	
	getCachedModule: function(moduleName) {
		var module = this.cachedModules[moduleName];
		if(instanceOf(module, woot.Module)) {
			return module;
		} else {
			return null;
		}
	},
	
	registerModule: function(module) {
		this.cachedModules[module.moduleName] = module;
	}
};

/**
 * Module factory method.
 * @param {Object} definition An object literal defining the module, which then gets added to the moduleCache.
 * @param {String} definition.moduleName Unique name of your module.
 * @param {Function} definition.getDom Method returning a JsonML-Array, that is used for parsing the DOM.
 */
woot.createModule = function(definition) {
	if (!definition.moduleName) {
		throw new Error('Your module definition needs a property "moduleName": ' + definition);
	}
	if (definition.Extends) {
		throw new Error('Modules must not define a property "Extends"');
	}
	var classDefinition = Object.merge({Extends: woot.Module}, definition);
	var clazz = new Class(classDefinition);
	var instance = new clazz();
	woot.moduleCache.registerModule(instance);
};

/**
 * @see woot.moduleCache.getModule
 */
woot.loadModule = function(moduleName, moduleExecutionConfig) {
	return woot.moduleCache.getModule(moduleName, moduleExecutionConfig);
};

/**
 * ModuleExecutor factory method.
 * @param {Object} definition An object literal defining the executor.
 * @param {String} definition.executorName Unique name of your executor and the same time the name of the function, you need to call after loading a module.
 * @param {Function} definition.getDom Method returning a JsonML-Array, that is used for parsing the DOM.
 */
woot.createModuleExecutor = function(definition) {
	if (!definition.executorName) {
		throw new Error('Your module executor definition needs a property "executorName": ' + definition);
	}
	if (definition.Extends) {
		throw new Error('Module executors must not define a property "Extends"');
	}
	if (woot.LoadedModule[definition.executorName]) {
		throw new Error('The executorName "' + definition.executorName + '" is a reserved name.');
	}
	// create new class, which extends ModuleExecutor and implements the stuff defined in "defition".
	var classDefinition = Object.merge({Extends: woot.ModuleExecutor}, definition);
	var clazz = new Class(classDefinition);
	var instance = new clazz();
	
	// add method "executorName" to LoadedModule class:
	var implementation = {};
	implementation[definition.executorName] = function() {
		// "this" will bound to the LoadedModule instance
		this.executor = instance;
		this.executionParameters = Array.from(arguments);
		if (this.executeImmediately) {
			this.execute();
		}
	};
	woot.LoadedModule.implement(implementation);
};