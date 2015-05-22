require("../../../less/about.less");

var React = require('react');
var Link = require('react-router').Link;

var AboutPage = React.createClass({
    /**
     * @return {object}
     */
    render: function() {
        return (
            <div id="aboutpage">
                This is About Page, go to <Link to="todo">Todo</Link> Page
            </div>
        );
    }

});

module.exports = AboutPage;