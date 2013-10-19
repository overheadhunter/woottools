woot.createModule({
	moduleName: "search",

	onDomReady: function() {
		$('query').set('text', this.routingContext.q);
	},

	getDomDefinition: function() {
		return ['div',
			['h2', 'search'],
			['p', 'this example shows how to use path parameters. Try changing it in the URL.'],
			['p',
				'You have searched for: ',
				['span', {'id': 'query', 'style': 'font-weight: bold;'}]
			]
		];
	}
});
