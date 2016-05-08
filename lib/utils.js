'use strict';

// log on debug

let log = (() => {
	if (process.env.debug) {
		return function() {
			console.log.apply(console, arguments);
		};
	} else {
		return () => {};
	}
})();

module.exports = {
	log
};
