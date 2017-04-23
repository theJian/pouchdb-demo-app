class Store {
  constructor(name, remote, onChange) {
    this.db = new PouchDB(name);

    // see: https://pouchdb.com/api.html#sync
    PouchDB.sync(name, `${remote}/${name}`, {
      live: true,
      retry: true,
    }).on('change', info => {
      onChange(info);
    })
  }

  getAll() {
    // get all items from storage
    // see: https://pouchdb.com/api.html#batch_fetch
    return this.db.allDocs({
      include_docs: true
    })
    .then(db => {
      return db.rows.map(row => row.doc)
    });
  }

  get(id) {
    return this.db.get(id);
  }

  save(item) {
    return item._id ?
      this.update(item):
      this.add(item);
  }

  add(item) {
    return this.db.post(item);
  }

  update(item) {
    return this.db.get(item._id)
      .then(updatingItem => {
        Object.assign(updatingItem, item);
        return this.db.put(updatingItem);
      })
  }

  remove(id) {
    return this.db.get(id)
      .then(item => {
        return this.db.remove(item);
      })
  }
}

window.Store = Store;
