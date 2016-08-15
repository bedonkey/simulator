var fs = require('fs');
var path = require("path");

function getTestcases(res) {
	fs.readdir(path.join(__dirname, '../testcase'), function(err, files) {
		if (err) {
			res.status(500).send(err);
		}
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

function getLessons(res, type, level) {
	fs.readdir(path.join(__dirname, '../lesson/' + type + '/' + level ), function(err, files) {
		if (err) {
			res.status(500).send(err);
		}
		res.json(files);
	})
};

function readLesson(res, name, type, level) {
	fs.readFile(path.join(__dirname, '../lesson/' + type + '/' + level + '/' + name ), 'utf8', function(err, data) {
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
        readTestcase(res, req.query.name.replace(/-/g,' '));
    });

    app.get('/api/lessons', function (req, res) {
    	var level = req.query.level;
		var type = req.query.type;
    	if (level && type) {
			getLessons(res, type, level);
    	}
    });

    app.get('/api/lesson', function (req, res) {
		var level = req.query.level;
		var type = req.query.type;
        readLesson(res, req.query.name.replace(/-/g,' '), type, level);
    });

    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, '../public', 'index.html'));
    });
};