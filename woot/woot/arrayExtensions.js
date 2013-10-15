Array.implement({
	parseJsonML: function() {
		if(typeOf(this[0]) === 'string') {
			var tagName = this[0];
			var attributes = {};
			var firstChildElementIndex = 1;
			if (typeOf(this[1]) === 'object') {
				attributes = this[1];
				firstChildElementIndex = 2;
			}
			var node = new Element(tagName, attributes);
			for (var i=firstChildElementIndex; i<this.length; i++) {
				if (typeOf(this[i]) === 'string') {
					node.appendText(this[i]);
				} else if (typeOf(this[i]) === 'array') {
					var subNode = this[i].parseJsonML();
					if(subNode != null) {
						node.grab(subNode);
					}
				}
			}
			return node;
		} else {
			return null;
		}
	}
});