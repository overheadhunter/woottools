woot.createModule({
	moduleName: "home",

	getDom: function() {
		return ['div',
			['h2', 'home'],
			['p', 'this is a very basic module, that only contains a simple JsonML-encoded DOM tree.']
		];
	}
});
