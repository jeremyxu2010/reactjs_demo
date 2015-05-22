require("../../node_modules/bootstrap/dist/css/bootstrap.min.css");
require("../less/main.less");

var React = require('react');
var ReactRouter = require('react-router');
var TodoPage = require('react-router-proxy?name=todo!./components/todo/TodoPage.react');
var AboutPage = require('react-router-proxy?name=about!./components/about/AboutPage.react');

var Route = ReactRouter.Route;
var DefaultRoute = ReactRouter.DefaultRoute;

var RouteHandler = ReactRouter.RouteHandler;

var App = React.createClass({
    render: function() {
        return (
            <RouteHandler/>
        );
    }
});

// declare our routes and their hierarchy
var routes = (
    <Route handler={App}>
        <Route name="todo" path="todo" handler={TodoPage}/>
        <Route name="about" path="about" handler={AboutPage}/>
        <DefaultRoute name="default" handler={TodoPage}/>
    </Route>
);

App.prototype.init = function () {
    ReactRouter.run(routes, ReactRouter.HashLocation, function(Root){
        React.render(<Root/>, document.body);
    });
};

var app = new App();
app.init();