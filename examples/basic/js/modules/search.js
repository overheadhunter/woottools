woot.createModule({
	moduleName: "search",

	onDomReady: function() {
		this.dom.getFirst('#query').set('text', 'You have searched for: ' + this.routingContext.q);
	},

	doEcho: function(event) {
		if(event) {
			event.preventDefault(); //prevent submitting of forms
		}
		
		$('statusLabel').set('text', $('echoInput').get('value'));
	},

	getDom: function() {
		return ['div',
			['h2', 'search'],
			['p', 'this example shows how to use path parameters. Try changing it in the URL.'],
			['p', {'id': 'query'}]
		];
	}
});
