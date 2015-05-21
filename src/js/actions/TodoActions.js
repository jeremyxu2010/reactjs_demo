/*
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoActions
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var TodoConstants = require('../constants/TodoConstants');
var webapi = require('../webapi/webapi');

var TodoActions = {

  /**
   * @param  {string} text
   */
  create: function(text, errorCb) {
    webapi.sendRequest({}, function(resp){
      AppDispatcher.dispatch({
        actionType: TodoConstants.TODO_CREATE,
        text: text
      });
    }, function(resp){
      errorCb(resp.msg);
    });
  },

  /**
   * @param  {string} id The ID of the ToDo item
   * @param  {string} text
   */
  updateText: function(id, text, errorCb) {
    webapi.sendRequest({}, function(resp){
      AppDispatcher.dispatch({
        actionType: TodoConstants.TODO_UPDATE_TEXT,
        id: id,
        text: text
      });
    }, function(resp){
      errorCb(resp.msg);
    });
  },

  /**
   * Toggle whether a single ToDo is complete
   * @param  {object} todo
   */
  toggleComplete: function(todo, errorCb) {
    webapi.sendRequest({}, function(resp){
      var id = todo.id;
      var actionType = todo.complete ?
          TodoConstants.TODO_UNDO_COMPLETE :
          TodoConstants.TODO_COMPLETE;

      AppDispatcher.dispatch({
        actionType: actionType,
        id: id
      });
    }, function(resp){
      errorCb(resp.msg);
    });
  },

  /**
   * Mark all ToDos as complete
   */
  toggleCompleteAll: function(errorCb) {
    webapi.sendRequest({}, function(resp){
      AppDispatcher.dispatch({
        actionType: TodoConstants.TODO_TOGGLE_COMPLETE_ALL
      });
    }, function(resp){
      errorCb(resp.msg);
    });
  },

  /**
   * @param  {string} id
   */
  destroy: function(id, errorCb) {
    webapi.sendRequest({}, function(resp){
      AppDispatcher.dispatch({
        actionType: TodoConstants.TODO_DESTROY,
        id: id
      });
    }, function(resp){
      errorCb(resp.msg);
    });
  },

  /**
   * Delete all the completed ToDos
   */
  destroyCompleted: function(errorCb) {
    webapi.sendRequest({}, function(resp){
      AppDispatcher.dispatch({
        actionType: TodoConstants.TODO_DESTROY_COMPLETED
      });
    }, function(resp){
      errorCb(resp.msg);
    });
  }

};

module.exports = TodoActions;
