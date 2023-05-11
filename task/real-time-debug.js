/*
 * LAN script real-time debug
 *
 * PC: Use "Live Server" plugin in VSCode to create a LAN backend
 * APP: After backend address is modified in script, use this script as script path
 * https://gist.github.com/NobyDa/bb09817e439871926dd939dfcb87a586
 */

!async function() {
	const _$ = new nobyda();
	const r = await new Promise(e => {
		_$.get({
			url: 'http://172.20.10.2:5500/mxbc.js' // LAN backend address
		}, (t, c, o) => {
			if (c && c.status == 200 && o) {
				_$.write(o, "local-cache");
				e(o);
			}
		});
		setTimeout(e, 100);
	});
	if (r) {
		console.log("🌐 Run local network script...");
		eval(r);
	} else {
		console.log("⚠️ Run cache script...");
		eval(_$.read("local-cache"))
	}

	function nobyda() {
		const isSurge = typeof $httpClient != "undefined";
		const isQuanX = typeof $task != "undefined";
		const adapterStatus = (response) => {
			if (response) {
				if (response.status) {
					response["statusCode"] = response.status
				} else if (response.statusCode) {
					response["status"] = response.statusCode
				}
			}
			return response
		};
		this.write = (value, key) => {
			if (isQuanX) return $prefs.setValueForKey(value, key);
			if (isSurge) return $persistentStore.write(value, key);
		};
		this.read = (key) => {
			if (isQuanX) return $prefs.valueForKey(key);
			if (isSurge) return $persistentStore.read(key);
		};
		this.get = (options, callback) => {
			if (isQuanX) {
				$task.fetch(options).then(response => {
					callback(null, adapterStatus(response), response.body)
				}, reason => callback(reason.error, null, null))
			}
			if (isSurge) {
				$httpClient.get(options, (error, response, body) => {
					callback(error, adapterStatus(response), body)
				})
			}
		};
		this.done = (value = {}) => $done(value)
	}
}();
