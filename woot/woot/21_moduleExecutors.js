/**
 * This module executor replaces all content inside of 'domParentNode' witht the DOM of the loaded module.
 */
woot.createModuleExecutor({
	/**
	 * Unique name of this executor.
	 * Should have a "method name flavour", as this executor will become available as a method of
	 * LoadedModule (so you can use woot.loadModule("someModule").executorName(param1, param2, ...).
	 *
	 * @property executorName
	 * @type {String}
	 */
	executorName: 'replaceDom',
	
	/**
	 * @param {Object} module A module, whose DOM will be injected into domParentNode.
	 * @param {Element} domParentNode The DOM node, whose content should be replaced.
	 * @param {Object} routingContext Optional routingContext to be passed through to the module.
	 */
	execute: function(module, domParentNode, routingContext) {
		if (routingContext) {
			module.routingContext = routingContext;
		}
		module.prepareDom();
		domParentNode.empty();
		domParentNode.grab(module.dom);
	}
});