
const fs = require('fs');
///////////////////////////////////////////////////////////////////////////
// This class provide CRUD operations on JSON objects collection text file 
// with the assumption that each object have an Id member.
// If the objectsFile does not exist it will be created on demand.
// Warning: no type and data validation is provided
///////////////////////////////////////////////////////////////////////////
module.exports =
    class Repository {
        constructor(objectsName) {
            this.objectsList = [];
            this.objectsFile = `./data/${objectsName}.json`;
            this.read();
        }
        read() {
            try {
                // Here we use the synchronus version readFile in order  
                // to avoid concurrency problems
                let rawdata = fs.readFileSync(this.objectsFile);
                // we assume here that the json data is formatted correctly
                this.objectsList = JSON.parse(rawdata);
            } catch (error) {
                if (error.code === 'ENOENT') {
                    // file does not exist, it will be created on demand
                    this.objectsList = [];
                }
            }
        }
        write() {
            // Here we use the synchronus version writeFile in order
            // to avoid concurrency problems  
            fs.writeFileSync(this.objectsFile, JSON.stringify(this.objectsList));
            this.read();
        }
        nextId() {
            let maxId = 0;
            for (let object of this.objectsList) {
                if (object.Id > maxId) {
                    maxId = object.Id;
                }
            }
            return maxId + 1;
        }
        add(object) {
            try {
                object.Id = this.nextId();
                this.objectsList.push(object);
                this.write();
                return object;
            } catch (error) {
                return null;
            }
        }
        getAll() {
            return this.objectsList;
        }
        get(id) {
            for (let object of this.objectsList) {
                if (object.Id === id) {
                    return object;
                }
            }
            return null;
        }
        remove(id) {
            let index = 0;
            for (let object of this.objectsList) {
                if (object.Id === id) {
                    this.objectsList.splice(index, 1);
                    this.write();
                    return true;
                }
                index++;
            }
            return false;
        }
        update(objectToModify) {
            let index = 0;
            for (let object of this.objectsList) {
                if (object.Id === objectToModify.Id) {
                    this.objectsList[index] = objectToModify;
                    this.write();
                    return true;
                }
                index++;
            }
            return false;
        }
        getAllSort(sort, list) {
            if (sort.indexOf("name") >= 0) {
                list = this.sort(list, "Name");
            }
            if (sort.indexOf("category") >= 0) {
                list = this.sort(list, "Category");
            }
            if (sort.indexOf("url") >= 0) {
                list = this.sort(list, "Url");
            }
            return list;
        }
        sort(list, filter) {
            if (filter == "Name") {
                list = list.sort(function (a, b) {
                    let x = a.Name.toLowerCase();
                    let y = b.Name.toLowerCase();
                    if (x < y) { return -1; }
                    if (x > y) { return 1; }
                    return 0;
                });
                return list;
            }
            if (filter == "Category") {
                list = list.sort(function (a, b) {
                    let x = a.Category.toLowerCase();
                    let y = b.Category.toLowerCase();
                    if (x < y) { return -1; }
                    if (x > y) { return 1; }
                    return 0;
                });
                return list;
            }
            if (filter == "Url") {
                list = list.sort(function (a, b) {
                    let x = a.Url.toLowerCase();
                    let y = b.Url.toLowerCase();
                    if (x < y) { return -1; }
                    if (x > y) { return 1; }
                    return 0;
                });
                return list;
            }
        }
        getBySearch(arr, searchKey, value) {
            var matches = [], i, key;
            if (searchKey == "Name") {
                for (i = arr.length; i--;){
                    if(arr[i].Name.toLowerCase().indexOf(value) > -1)
                        matches.push(arr[i]); 
                } 
                return matches;
            }
            if (searchKey == "Category") {
                for (i = arr.length; i--;){
                    if(arr[i].Category.toLowerCase().indexOf(value) > -1)
                        matches.push(arr[i]); 
                }
                return matches;
            }
        }
    }