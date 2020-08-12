'use stict';

function Route(name, htmlName, defaultRoute, init) {
    try {
        if (!name || !htmlName) {
            throw 'error: name and htmlName params are mandatories';
        }
        this.constructor(name, htmlName, defaultRoute, init);
    } catch (e) {
        console.error(e);
    }
}

Route.prototype = {
    name: undefined,
    htmlName: undefined,
    default: undefined,
    init: undefined,
    constructor: function (name, htmlName, defaultRoute, init) {
        this.name = name;
        this.htmlName = htmlName;
        this.default = defaultRoute;
        this.init = init;
    },
    isActiveRoute: function (hashedPath) {
        return hashedPath.replace('#', '') === this.name;
    }
}