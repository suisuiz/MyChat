util = require('@/common/util.js')

module.exports = {
	writeFile(res) {
		// #ifdef APP-PLUS
		plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function (fs) {
			let entry = fs.root;
			entry.getFile("log.txt", {
				create: true
			}, function (fileEntry) {
				fileEntry.createWriter(function (writer) {
					writer.seek(writer.length);
					time = util.formatDate(new Date())
					writer.write(time + ' ' + res + '\r\n');
				})
			}, function (e) {
				console.log(e)
			})
		})
		// #endif
	}
};
