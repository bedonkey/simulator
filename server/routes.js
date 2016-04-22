var fs = require('fs');
var path = require("path");

function getTestcases(res) {
	fs.readdir(path.join(__dirname, '../testcase'), function(err, files) {
		if (err) {
			res.status(500).send(err);
		}
		for (var i = files.length - 1; i >= 0; i--) {
			if (files[i].startsWith('.')) {
				files.splice(i, 1);
			}
		};
		res.json(files);
	})
};

function readTestcase(res, name) {
	fs.readFile(path.join(__dirname, '../testcase/' + name + '.robot'), 'utf8', function(err, data) {
		if (err) {
			res.status(500).send(err);
		}
		res.status(200).send(data);
	})
};

module.exports = function (app) {
    app.get('/api/testcases', function (req, res) {
        getTestcases(res);
    });

    app.get('/api/testcase', function (req, res) {
    	console.log(req.query.name.replace(/-/g,' '));
        readTestcase(res, req.query.name.replace(/-/g,' '));
    });

    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, '../public', 'index.html'));
    });
};