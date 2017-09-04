var callbackToPromise = require("./callback_to_promise");

export default class Record {
  constructor(table, recordId, recordJson) {
    this._table = table;
    this.id = recordId || recordJson.id;
    this.setRawJson(recordJson);

    this.save = callbackToPromise(this.save, this);
    this.patchUpdate = callbackToPromise(this.patchUpdate, this);
    this.putUpdate = callbackToPromise(this.putUpdate, this);
    this.destroy = callbackToPromise(this.destroy, this);
    this.fetch = callbackToPromise(this.fetch, this);

    this.updateFields = this.patchUpdate;
    this.replaceFields = this.putUpdate;
  }
  getId() {
    return this.id;
  }
  get(columnName) {
    return this.fields[columnName];
  }
  set(columnName, columnValue) {
    this.fields[columnName] = columnValue;
  }
  save(done) {
    this.putUpdate(this.fields, done);
  }
  patchUpdate(cellValuesByName, opts, done) {
    if (!done) {
      done = opts;
      opts = {};
    }
    var updateBody = {
      fields: cellValuesByName,
      ...opts
    };

    this._table._base.runAction(
      "patch",
      "/" + this._table._urlEncodedNameOrId() + "/" + this.id,
      {},
      updateBody,
      (err, response, results) => {
        if (err) {
          done(err);
          return;
        }

        this.setRawJson(results);
        done(null, this);
      }
    );
  }
  putUpdate(cellValuesByName, opts, done) {
    if (!done) {
      done = opts;
      opts = {};
    }
    this._table._base.runAction(
      "put",
      "/" + this._table._urlEncodedNameOrId() + "/" + this.id,
      {},
      {
        fields: cellValuesByName,
        ...opts
      },
      (err, response, results) => {
        if (err) {
          done(err);
          return;
        }

        this.setRawJson(results);
        done(null, this);
      }
    );
  }
  destroy(done) {
    this._table._base.runAction(
      "delete",
      "/" + this._table._urlEncodedNameOrId() + "/" + this.id,
      {},
      null,
      (err, response, results) => {
        if (err) {
          done(err);
          return;
        }

        done(null, this);
      }
    );
  }

  fetch(done) {
    this._table._base.runAction(
      "get",
      "/" + this._table._urlEncodedNameOrId() + "/" + this.id,
      {},
      null,
      (err, response, results) => {
        if (err) {
          done(err);
          return;
        }

        this.setRawJson(results);
        done(null, this);
      }
    );
  }
  setRawJson(rawJson) {
    this._rawJson = rawJson;
    this.fields = (this._rawJson && this._rawJson.fields) || {};
  }
}
