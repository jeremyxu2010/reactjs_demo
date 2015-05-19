/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoStore
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var TodoConstants = require('../constants/TodoConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _todos = {};

/**
 * Create a TODO item.
 * @param  {string} text The content of the TODO
 */
function create(text, callback) {
  // Hand waving here -- not showing how this interacts with XHR or persistent
  // server-side storage.
  // Using the current timestamp + random number in place of a real id.
  var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  _todos[id] = {
    id: id,
    complete: false,
    text: text
  };
  callback({"success": true});
}

/**
 * Update a TODO item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(id, updates, callback) {
  _todos[id] = assign({}, _todos[id], updates);
  callback({"success": true});
  //callback({"success": false, "msg": "update todo {id = " + id + "} error"});
}

/**
 * Update all of the TODO items with the same object.
 *     the data to be updated.  Used to mark all TODOs as completed.
 * @param  {object} updates An object literal containing only the data to be
 *     updated.

 */
function updateAll(updates, callback) {
  for (var id in _todos) {
      _todos[id] = assign({}, _todos[id], updates);
  }
  callback({"success": true});
}

/**
 * Delete a TODO item.
 * @param  {string} id
 */
function destroy(id, callback) {
  //delete _todos[id];
  //callback({"success": true});
  callback({"success": false, "msg": "destroy todo {id = " + id + "} error"});
}

/**
 * Delete all the completed TODO items.
 */
function destroyCompleted(callback) {
  for (var id in _todos) {
    if (_todos[id].complete) {
      delete _todos[id];
    }
  }
  callback({"success": true});
}

var TodoStore = assign({}, EventEmitter.prototype, {

  /**
   * Tests whether all the remaining TODO items are marked as completed.
   * @return {boolean}
   */
  areAllComplete: function() {
    for (var id in _todos) {
      if (!_todos[id].complete) {
        return false;
      }
    }
    return true;
  },

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getAll: function() {
    return _todos;
  },

  emitChange: function(result) {
    this.emit(CHANGE_EVENT, result);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  var text;

  switch(action.actionType) {
    case TodoConstants.TODO_CREATE:
      text = action.text.trim();
      if (text !== '') {
        create(text, function(result){
          TodoStore.emitChange(result);
        });
      }
      break;

    case TodoConstants.TODO_TOGGLE_COMPLETE_ALL:
      if (TodoStore.areAllComplete()) {
        updateAll({complete: false}, function(result){
            TodoStore.emitChange(result);
        });
      } else {
        updateAll({complete: true}, function(result){
            TodoStore.emitChange(result);
        });
      }

      break;

    case TodoConstants.TODO_UNDO_COMPLETE:
      update(action.id, {complete: false}, function(result){
          TodoStore.emitChange(result);
      });
      break;

    case TodoConstants.TODO_COMPLETE:
      update(action.id, {complete: true}, function(result){
          TodoStore.emitChange(result);
      });
      break;

    case TodoConstants.TODO_UPDATE_TEXT:
      text = action.text.trim();
      if (text !== '') {
        update(action.id, {text: text}, function(result){
            TodoStore.emitChange(result);
        });
      }
      break;

    case TodoConstants.TODO_DESTROY:
      destroy(action.id, function(result){
          TodoStore.emitChange(result);
      });
      break;

    case TodoConstants.TODO_DESTROY_COMPLETED:
      destroyCompleted(function(result){
          TodoStore.emitChange(result);
      });
      break;

    default:
      // no op
  }
});

module.exports = TodoStore;
