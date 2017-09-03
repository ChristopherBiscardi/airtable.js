"use strict";

var _ = require("lodash");

var assert = require("assert");
var async = require("async");

var AirtableError = require("./airtable_error");
var Class = require("./class");
var Query = require("./query");
var Record = require("./record");
var callbackToPromise = require("./callback_to_promise");

var Table = Class.extend({
  init: function(base, tableId, tableName) {
    this._base = base;
    assert(tableId || tableName, "Table name or table ID is required");
    this.id = tableId;
    this.name = tableName;

    // Public API
    this.find = callbackToPromise(this._findRecordById, this);
    this.select = this._selectRecords.bind(this);
    this.create = callbackToPromise(this._createRecord, this);
    this.update = callbackToPromise(this._updateRecord, this);
    this.destroy = callbackToPromise(this._destroyRecord, this);
    this.replace = callbackToPromise(this._replaceRecord, this);
  },
  _findRecordById: function(recordId, done) {
    var record = new Record(this, recordId);
    record.fetch(done);
  },
  _selectRecords: function(params) {
    if (_.isUndefined(params)) {
      params = {};
    }

    if (arguments.length > 1) {
      console.warn(
        "Airtable: `select` takes only one parameter, but it was given " +
          arguments.length +
          " parameters. " +
          "Use `eachPage` or `firstPage` to fetch records."
      );
    }

    if (_.isPlainObject(params)) {
      var validationResults = Query.validateParams(params);

      if (validationResults.errors.length) {
        var formattedErrors = validationResults.errors.map(function(error) {
          return "  * " + error;
        });

        assert(
          false,
          "Airtable: invalid parameters for `select`:\n" +
            formattedErrors.join("\n")
        );
      }

      if (validationResults.ignoredKeys.length) {
        console.warn(
          "Airtable: the following parameters to `select` will be ignored: " +
            validationResults.ignoredKeys.join(", ")
        );
      }

      return new Query(this, validationResults.validParams);
    } else {
      assert(
        false,
        "Airtable: the parameter for `select` should be a plain object or undefined."
      );
    }
  },
  _urlEncodedNameOrId: function() {
    return this.id || encodeURIComponent(this.name);
  },
  _createRecord: function(recordData, optionalParameters, done) {
    var that = this;
    if (!done) {
      done = optionalParameters;
      optionalParameters = {};
    }
    var requestData = _.extend({ fields: recordData }, optionalParameters);
    this._base.runAction(
      "post",
      "/" + that._urlEncodedNameOrId() + "/",
      {},
      requestData,
      function(err, resp, body) {
        if (err) {
          done(err);
          return;
        }

        var record = new Record(that, body.id, body);
        done(null, record);
      }
    );
  },
  _updateRecord: function(recordId, recordData, opts, done) {
    var record = new Record(this, recordId);
    if (!done) {
      done = opts;
      record.patchUpdate(recordData, done);
    } else {
      record.patchUpdate(recordData, opts, done);
    }
  },
  _replaceRecord: function(recordId, recordData, opts, done) {
    var record = new Record(this, recordId);
    if (!done) {
      done = opts;
      record.putUpdate(recordData, done);
    } else {
      record.putUpdate(recordData, opts, done);
    }
  },
  _destroyRecord: function(recordId, done) {
    var record = new Record(this, recordId);
    record.destroy(done);
  }
});

module.exports = Table;
