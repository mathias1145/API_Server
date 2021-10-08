exports.initBookmarks = function (){
    const BookmarksRepository = require('./Repository.js');
    const Bookmark = require('./Bookmark');
    const bookmarksRepository = new BookmarksRepository("bookmarks");
    bookmarksRepository.add(new Bookmark('Google','https://www.google.com/','Browser'));
    bookmarksRepository.add(new Bookmark('Youtube','https://www.youtube.com/','Video'));
    bookmarksRepository.add(new Bookmark('WebMail Videotron','https://courrielweb.videotron.com/cw/displayLoginFrLegacyResidentiel','Email')); 
    bookmarksRepository.add({
        Id : 0,
        Name: 'Facebook',
        Url: 'https://www.facebook.com/',
        Category: 'Social'
      });
      bookmarksRepository.add({
        Id : 0,
        Name: 'SalihaYacoub',
        Url: 'http://salihayacoub.com/',
        Category: 'School'
    });
}