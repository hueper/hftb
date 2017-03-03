## hftb

Photoblog (PWA), built with Ionic 2. http://hftb.eu

#### Description
I wanted to have a very(!) simple photoblog - built with Ionic 2 - providing the following two features:<br/>
- As an owner you can upload images via mobile app.
- As a visitor you just scroll down to view images.

#### Includes
- <b>Client</b>: just display images in browser
- <b>Mobile</b>: like *Client*, but contains CRUD operations. Deploy to iOS, Android, ...
- <b>Server</b>: handle images with multer and mongoose data to mongodb

#### Features
- Google Maps API to autocomplete geodata input
- infinite-scroll to load images while scrolling

#### Install
```shell
    $ git clone https://github.com/hueper/hftb.git

    # Mobile:
    $ cd hftb/mobile
    $ npm install
    $ ionic serve
    # or
    $ ionic serve --prod

    # Client:
    $ cd hftb/client
    $ npm install
    $ ionic serve
    # or
    $ ionic serve --prod

    # Server:
    # make sure you have mongodb
    $ cd hftb/server
    $ npm install
    $ node server.js
```

#### Contributions
Are very welcome

#### License
MIT
