var libs = {
    React: require('react'),
    ReactRouter: require('react-router'),
    ReactBootstrap: require('react-bootstrap'),
    keyMirror: require('keymirror'),
    Flux: require('flux'),
    _: require('lodash'),
    Immutable: require('immutable'),
    Events: require('events'),
    classSet: require('react-classset')
};

if(window){
    window.libs = libs;
}

module.exports = libs;

