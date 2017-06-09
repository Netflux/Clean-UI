const sass = require('node-sass')
const fs = require('fs')
const chokidar = require('chokidar')
const static = require('node-static')

function rebuildSass() {
	process.stdout.write('Rebuilding CSS...\n')

	sass.render({
		file: './scss/clean-ui.scss',
		outFile: './dist/css/clean-ui.css'
	}, function(err, result) {
		if (err) {
			return console.error(err.formatted)
		}

		fs.writeFile('./dist/css/clean-ui.css', result.css, function(err) {
			if (err) {
				return console.error(err)
			}

			console.log('Done! Waiting for changes...\n')
		})
	})
}

const server = new static.Server('./dist')

require('http').createServer(function(request, response) {
	request.addListener('end', function() {
		server.serve(request, response);
	}).resume();
}).listen(3000, function() {
	console.log('HTTP Server running at localhost:3000\n')

	rebuildSass()

	chokidar.watch('./scss').on('change', function(path, stats) {
		process.stdout.write(`Modified ${path}. `)
		rebuildSass()
	})
});
