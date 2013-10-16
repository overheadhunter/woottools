/*
 * This module executor replaces all content inside of 'obj' witht the DOM of the loaded module.
 *
 * Parameters in the moduleExecutionConfig are:
 * - obj: a dom element, that will be parent of the module's dom
 * - routingContext: object passed from the router to the module
 */
woot.createModuleExecutor({
	executorName: 'replaceDom',
	
	execute: function(module, moduleExecutionConfig) {
		if(typeOf(moduleExecutionConfig.obj) != 'element') {
			throw new Error('replaceDom executor needs a property "obj", whose DOM subtree can be replaced.');
		}
		if (moduleExecutionConfig.routingContext) {
			module.routingContext = moduleExecutionConfig.routingContext;
		}
		module.prepareDom();
		moduleExecutionConfig.obj.empty();
		moduleExecutionConfig.obj.grab(module.dom);
	}
});