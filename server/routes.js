function getTestcase(res) {
    res.json("");
};
module.exports = function (app) {
    app.get('/get/testcase', function (req, res) {
        getTestcase(res);
    });

    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, '../public', 'index.html'));
    });
};