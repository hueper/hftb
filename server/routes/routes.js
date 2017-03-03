var express = require('express');
var user = require('../methods/user.controller');
var image = require('../methods/image.controller');

var router = express.Router();

router.post('/api/authenticate', user.authenticate);
router.get('/api/getinfo', user.getinfo);
router.post('/api/adduser', user.addNew);

router.get('/api/images', image.getAllImages);
router.get('/api/images/removeAllImages', image.removeAllImages);
router.get('/api/images/createdAt/ASC/:imageId', image.getImages);
router.delete('/api/images/:imageId', image.deleteImage);

router.post('/api/upload', image.uploadFile);
router.post('/api/images/saveImageMetaData', image.saveImageMetaData);

router.param('imageId', image.imageById);

module.exports = router;
