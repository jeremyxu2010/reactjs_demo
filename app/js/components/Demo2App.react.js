var React = require('react');
var ReactRouter = require('react-router');
var TodoPage = require('./todo/TodoPage.react.js');
var AboutPage = require('./about/AboutPage.react.js');

var Route = ReactRouter.Route;
var DefaultRoute = ReactRouter.DefaultRoute;


var RouteHandler = ReactRouter.RouteHandler;

var Demo2App = React.createClass({
    render: function() {
        return (
            <RouteHandler/>
        );
    }
});

// declare our routes and their hierarchy
var routes = (
    <Route handler={Demo2App}>
        <Route name="todo" path="todo" handler={TodoPage}/>
        <Route name="about" path="about" handler={AboutPage}/>
        <DefaultRoute name="default"  handler={TodoPage}/>
    </Route>
);

Demo2App.prototype.init = function () {
    ReactRouter.run(routes, ReactRouter.HashLocation, function(Root){
        React.render(<Root/>, document.body);
    });
};

module.exports = Demo2App;