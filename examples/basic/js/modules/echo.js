woot.createModule({
	moduleName: "echo",

	doEcho: function(event) {
		if(event) {
			event.preventDefault(); //prevent submitting of forms
		}
		
		$('statusLabel').set('text', $('echoInput').get('value'));
	},

	getDomDefinition: function() {
		return ['div',
			['h2', 'echo module'],
			['p', 'this module shows how to hook up events in a module.'],
			['form',
			 ['input', {'type': 'text', 'events': {'submit': this.doEcho}, 'id': 'echoInput'}],
			 ['input', {'type': 'submit', 'events': {'click': this.doEcho}, 'value': 'echo!'}],
			 ['p', {'id': 'statusLabel'}]
			]
		];
	}
});
