var Image = require('../model/image');
var config = require('../config/database');
var multer = require('multer');
var jwt = require('jwt-simple');

var images = {
  getAllImages : function (req, res) {
    Image.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .exec(function (err, images) {
      if (err) throw err;

      if (!images) {
        res.status(403).send({
          success: false,
          msg: 'No images found'
        });
      } else {
        console.log('All images: ');
        console.log(images);
        res.json({
          success: true,
          images: images
        });
      }
    });
  },
  getImages : function (req, res) {
    /**
     * sort by: sortBy, order
     * cut after: lastValue
     * return 20 images
     */
    console.log(req.image);
    Image.
      find({
        createdAt : { $lt: req.image.createdAt }
      }).
      limit(5).
      sort({ createdAt: -1 }).
      select({ filename: 1, createdAt: 1, size: 1, location: 1, date: 1 }).
      exec(function (err, images) {
        if (err) throw err;

        if (!images) {
          res.status(403).send({
            success: false,
            msg: 'No images found'
          });
        } else {
          console.log(images);
          res.json({
            success: true,
            images: images
          });
        }
      });
  },
  imageById : function (req, res, next, id) {
    Image.findById(id).exec(function (err, image) {
      if (err) {
        return next(err);
      } else if (!image) {
        return res.status(404).send({
          message: 'No image with that identifier has been found'
        });
      }
      req.image = image;
      next();
    });
  },
  uploadFile : function (req, res) {
    if (true) {
      var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, '../client/www/uploads/')
        },
        filename: function (req, file, cb) {

          var ext = file.originalname.split('.')[1];
          var newFilename = file.fieldname + '-' + Date.now() + '.' + ext;
          cb(null, newFilename)
        }
      })
      var upload = multer({ storage: storage }).single('file');

      uploadImage()
        .then(function () {
          return res.json({
            success: true,
            msg: 'File successfully uploaded',
            file: req.file
          });
        })
        .catch(function (err) {
          res.status(422).send(err);
        });
    } else {
      return res.status(401).send('No authorization');
    }

    function uploadImage () {
      return new Promise(function (resolve, reject) {
        upload(req, res, function (uploadError) {
          if (uploadError) {
            reject('error while uploading');
          } else {
            resolve();
          }
        });
      });
    }
  },
  saveImageMetaData : function (req, res) {
    var newImage = Image({
      filename: req.body.filename,
      size: req.body.size,
      location: req.body.location,
      date: req.body.date
    });

    newImage.save(function(err, newImage) {
      if (err) {
        console.log('save metadata err');
        console.log(err);
        res.json({
          success: false,
          msg: 'Failed to save'
        })
      } else {
        console.log('save metadata success');
        res.json({
          success: true,
          msg: 'Successfully saved'
        });
      }
    })
  },
  removeAllImages : function (req, res) {
    Image.remove({}, function (err, removed) {
      if (err) {
        res.json({
          success: false,
          msg: 'Failed to remove all images'
        })
      } else {
        res.json({
          success: true,
          msg: 'Successfully removed all images'
        });
      }
    });
  },
  deleteImage : function (req, res) {
    Image.findById(req.image.id).remove(function (err) {
      if (err) {
        res.json({
          success: false,
          msg: 'Failed to remove image'
        })
      } else {
        res.json({
          success: true,
          msg: 'Successfully removed image '+req.image.id
        });
      }
    })
  }
}

module.exports = images;
