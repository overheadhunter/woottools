woot.createModule({
	moduleName: "echo",

	onDomReady: function() {
		console.log("dom is ready!");
	},

	doEcho: function(event) {
		if(event) {
			event.preventDefault(); //prevent submitting of forms
		}
		
		$('statusLabel').set('text', $('echoInput').get('value'));
	},

	getDom: function() {
		return ['div',
			['h2', 'echo module'],
			['form',
			 ['input', {'type': 'text', events: {'submit': this.doEcho}, 'id': 'echoInput'}],
			 ['input', {'type': 'submit', events: {'click': this.doEcho}, 'value': 'echo!'}],
			 ['p', {'id': 'statusLabel'}]
			]
		];
	}
});
