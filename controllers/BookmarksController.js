const Repository = require('../models/Repository');

module.exports =
    class BookmarksController extends require('./Controller') {
        constructor(req, res) {
            super(req, res);
            this.bookmarksRepository = new Repository('Bookmarks');
        }
        getAll() {
            this.response.JSON(this.bookmarksRepository.getAll());
        }
        get(id) {
            let params = this.getQueryStringParams();
            var list = this.bookmarksRepository.getAll();
            if (!isNaN(id)) {
                list = this.bookmarksRepository.get(id);
            }
            if (params != null) {
                if (Object.keys(params).length != null) {
                    Object.keys(params).forEach(element => {
                        if (element == "sort") {
                            list = this.bookmarksRepository.getAllSort(params["sort"], list);
                        }
                        if (element == "name") {
                            list = this.bookmarksRepository.getBySearch(list, "Name", params["name"]);
                        }
                        if (element == "category") {
                            list = this.bookmarksRepository.getBySearch(list, "Category", params["category"]);
                        }
                    })
                }
            }
            //this.response.JSON(this.bookmarksRepository.getAll());
            this.response.JSON(list);
        }
        post(bookmark) {
            // todo : validate bookmark before insertion
            // todo : avoid duplicates
            let newBookmark = this.bookmarksRepository.add(bookmark);
            if (newBookmark) {
                this.response.created(JSON.stringify(newBookmark));
            }
            else
                this.response.internalError();
        }
        put(bookmark) {
            // todo : validate bookmark before updating
            if (this.bookmarksRepository.update(bookmark))
                this.response.ok();
            else
                this.response.notFound();
        }
        remove(id) {
            if (this.bookmarksRepository.remove(id))
                this.response.accepted();
            else
                this.response.notFound();
        }
        help() {
            let content = "<div style=font-family:arial>";
            content += "<h3>GET : Bookmarks endpoint  <br> List of possible query strings:</h3><hr>";
            content += "<h4>? sort = name <br>return all bookmarks sorted by name</h4>"
            content += "<h4>? sort = category <br>return all bookmarks sorted by category</h4>"
            content += "<h4>? name = string <br>return all bookmarks with the name string</h4>"
            content += "<h4>? category = string <br>return all bookmarks with the category string</h4>"
            this.res.writeHead(200, { 'content-type': 'text/html' });
            this.res.end(content) + "</div>";
        }
    }