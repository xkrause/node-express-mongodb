var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */
router.get('/contact', function(req, res) {
    var db = req.db;
    db.collection('contact').find().toArray(function (err, items) {
        res.json(items);
    });
});

/*
 * POST to addcontact.
 */
router.post('/addcontact', function(req, res) {
    var db = req.db;
    db.collection('contact').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deletecontact.
 */
router.delete('/deletecontact/:id', function(req, res) {
    var db = req.db;
    var contactToDelete = req.params.id;
    db.collection('contact').removeById(contactToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;