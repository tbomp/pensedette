AR = {};
AR.DataSource = SC.DataSource.extend({

  // fetch

  fetch: function(store, query) {
    var url = query.url || this._urlFor(query.get('recordType'), store);
    this._sendRequest({
      url: url,
      complete: '_fetchDidComplete'
    }, store, query);
    return true;
  },

  // retrieve

  retrieveRecord: function(store, storeKey, id) {
    var url = this._urlFor(query.get('recordType'), store, storeKey);
    this._sendRequest({
      url: url,
      complete: '_retrieveRecordDidComplete'
    }, store);
    return true;
  },

  // create

  createRecord: function(store, storeKey) {
    return this._createOrUpdateRecord(store, storeKey);
  },

  // update

  updateRecord: function(store, storeKey) {
    return this._createOrUpdateRecord(store, storeKey, true);
  },

  // destroy

  destroyRecord: function(store, storeKey) {
    var url = this._urlFor(store.recordTypeFor(storeKey), store, storeKey);
    this._sendRequest({
      url: url,
      method: 'DELETE',
      complete: '_destroyRecordDidComplete',
    }, store, storeKey);
    return true;
  },

  // @private

  _createOrUpdateRecord: function(store, storeKey, update) {
    var url = this._urlFor(store.recordTypeFor(storeKey), store, storeKey);
    this._sendRequest({
      url: url,
      method: (update ? 'PUT' : 'POST'),
      complete: '_writeRecordDidComplete',
      data: store.readDataHash(storeKey)
    }, store, storeKey);
    return true;
  },

  _fetchDidComplete: function(response, store, query) {
    if (!response.isError) {
      var storeKeys = store.loadRecords(query.get('recordType'), response.data);
      if (!query.get('isLocal')) {
        store.loadQueryResults(query, storeKeys);
      }
      store.dataSourceDidFetchQuery(query);
    } else {
      store.dataSourceDidErrorQuery(query, response);
    }
  },

  _retrieveRecordDidComplete: function(response, store, storeKey) {
    if (!response.isError) {
      var data = response.data;
      store.dataSourceDidComplete(storeKey, data);
    } else {
      this._parseError(response);
      store.dataSourceDidError(storeKey, response);
    }
  },

  _writeRecordDidComplete: function(response, store, storeKey) {
    if (!response.isError) {
      var data = response.data;
      if (store.idFor(storeKey)) {
        store.dataSourceDidComplete(storeKey, data);
      } else {
        store.dataSourceDidComplete(storeKey, data, data.id);
      }
    } else {
      store.dataSourceDidError(storeKey, response);
    }
  },

  _destroyRecordDidComplete: function(response, store, storeKey) {
    if (!response.isError) {
      store.dataSourceDidDestroy(storeKey);
    } else {
      store.dataSourceDidError(storeKey, response);
    }
  },

  _urlFor: function(recordType, store, storeKey) {
    var id, resourceName = recordType.resourceName;
    if (!resourceName) {
      throw SC.Error.create("You have to define resourceName on %@ ...".fmt(recordType));
    }
    if (storeKey) {
      id = store.idFor(storeKey); 
    }
    if (id) {
      return '/%@/%@'.fmt(resourceName, id);
    }
    return '/%@'.fmt(resourceName);
  },

  _sendRequest: function() {
    var args = SC.$.makeArray(arguments),
        options = args.shift(),
        complete = (typeof options.complete === 'string') ? this[options.complete] : options.complete;
    SC.$.ajax({
      url: options.url,
      type: options.method || 'GET',
      dataType: 'json',
      data: options.data,
      context: this,
      success: function(data, textStatus, jqXHR) {
        complete.apply(this, [{
          data: data,
          status: jqXHR.status
        }].concat(args));
      },
      error: function(jqXHR, textStatus, errorThrown) {
        var data = {};
        try { data = SC.$.parseJSON(jqXHR.responseText); } catch (e) {}
        complete.apply(this, [{
          isError: true,
          status: jqXHR.status,
          data: data,
          error: errorThrown
        }].concat(args));
      }
    });
  }
});
