/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * This component operates as a "Controller-View".  It listens for changes in
 * the TodoStore and passes the new data to its children.
 */

var Footer = require('./Footer.react');
var Header = require('./Header.react');
var MainSection = require('./MainSection.react');
var React = require('react');
var TodoStore = require('../../stores/TodoStore');
var Link = require('react-router').Link;
var Alert = require('react-bootstrap').Alert;
var OverlayMixin = require('react-bootstrap').OverlayMixin;
var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;
var assign = require('object-assign');

/**
 * Retrieve the current TODO data from the TodoStore
 */
function getTodoState() {
  return {
    allTodos: TodoStore.getAll(),
    areAllComplete: TodoStore.areAllComplete()
  };
}

var TodoPage = React.createClass({

  mixins: [OverlayMixin],

  toggleErrorMsgDlg : function() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  },

  // This is called by the `OverlayMixin` when this component
  // is mounted or updated and the return value is appended to the body.
  renderOverlay: function() {
    if (!this.state.isModalOpen) {
      return <span/>;
    }

    return (
        <Modal bsStyle='primary' title='Modal heading' onRequestHide={this.toggleErrorMsgDlg}>
          <div className='modal-body'>
            {this.state.errorMsg}
          </div>
          <div className='modal-footer'>
            <Button onClick={this.toggleErrorMsgDlg}>Close</Button>
          </div>
        </Modal>
    );
  },

  getInitialState: function() {
    return assign({}, getTodoState(), {isModalOpen: false, errorMsg: ''});
  },

  componentDidMount: function() {
    TodoStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    TodoStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function() {
  	return (
        <div id="todopage">
          <section>
            <div>
              <Header />
              <MainSection
                  allTodos={this.state.allTodos}
                  areAllComplete={this.state.areAllComplete}
                  />
              <Footer allTodos={this.state.allTodos} />
            </div>
          </section>
          <span>This is Todo Page, go to <Link to="about">About</Link> Page</span>
        </div>
      );
  },

  /**
   * Event handler for 'change' events coming from the TodoStore
   */
  _onChange: function(result) {
    if(result.success) {
      this.setState(getTodoState());
    } else {
      this.setState({
        errorMsg: result.msg
      });
      this.toggleErrorMsgDlg();
    }
  }

});

module.exports = TodoPage;
