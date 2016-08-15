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

function getLessons(res) {
	fs.readdir(path.join(__dirname, '../lesson'), function(err, files) {
		if (err) {
			res.status(500).send(err);
		}
		res.json(files);
	})
};

function readLesson(res, name) {
	fs.readFile(path.join(__dirname, '../lesson/' + name), 'utf8', function(err, data) {
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
    	if (req.query.level) {
    		console.log(req.query.level)
    	}
        getLessons(res);
    });

    app.get('/api/lesson', function (req, res) {
        readLesson(res, req.query.name.replace(/-/g,' '));
    });

    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, '../public', 'index.html'));
    });
};