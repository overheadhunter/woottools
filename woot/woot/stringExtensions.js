/* General String extensions */
String.implement({
	trimPrecedingChars: function(c) {
		if (this.length > 0 && this.charAt(0) == c) {
			var subStr = this.substr(1);
			return subStr.trimPrecedingChars(c);
		} else {
			return this;
		}
	},
	
	trimTrailingChars: function(c) {
		if (this.length > 0 && this.charAt(this.length-1) == c) {
			var subStr = this.substr(0, this.length-1);
			return subStr.trimTrailingChars(c);
		} else {
			return this;
		}
	},
	
	trimChars: function(c) {
		return this.trimPrecedingChars(c).trimTrailingChars(c);
	},
	
	startsWith: function (str) {
		return this.slice(0, str.length) == str;
	},
	
	endsWith: function(str) {
		return this.slice(-str.length) == str;
	}
});

/* String path extensions */

String.implement({
	normalizedPath: function() {
		return this.replace(/\/+/g, '/');
	},
	
	pathComponents: function() {
		return this.trimChars('/').normalizedPath().split('/');
	},
	
	moduleStack: function() {
		var pathComponents = this.pathComponents();
		var result = new Array();
		pathComponents.each(function(comp) {
			if(comp.charAt(0) == '_') {
				result.push(comp);
			}
		});
		return result;
	},
	
	paramStack: function() {
		var pathComponents = this.pathComponents();
		var keys = new Array();
		var values = new Array();
		pathComponents.each(function(comp) {
			var paramSeparatorIndex = comp.indexOf(':');
			if (paramSeparatorIndex > 0) {
				var key = comp.substr(0, paramSeparatorIndex);
				var value = comp.substr(paramSeparatorIndex+1);
				keys.push(key);
				values.push(value);
			}
		});
		return values.associate(keys);
	},
	
	appendPathComponent: function(comp) {
		var cleanedComp = comp.trimPrecedingChars('/').normalizedPath();
		return this.trimTrailingChars('/').concat('/').concat(cleanedComp);
	},
	
	appendQueryString: function(key, value) {
		var path = this.trimTrailingChars('/');
		var encodedKey = encodeURIComponent(key);
		var encodedValue = encodeURIComponent(value);
		if (path.indexOf('?') == -1) {
			return path.concat('?').concat(encodedKey).concat('=').concat(encodedValue);
		} else {
			return path.concat('&').concat(encodedKey).concat('=').concat(encodedValue);
		}
	}
});