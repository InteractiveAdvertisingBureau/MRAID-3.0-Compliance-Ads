window.MRAID_ENV = {};
var mraid = {
    listeners: [],
    getVersion: function(){
        return 3;
    },
    addEventListener: function(eventName, handler){
        this.listeners[eventName] = this.listeners[eventName] || [];
        this.listeners[eventName].push(handler);
        if(eventName === "exposureChange") {
            setTimeout(runExposureChangeTests(), 1000);
        }
    },
    getState: function(){
        return "default";
    },
    emit: function(eventName){
        var handlers = this.listeners[eventName];
        if (!handlers) return;
        var args = Array.from(arguments);
        args.shift();
        handlers.forEach(function(handler){
            handler.apply(null,args);
        });
    }
};


// The test cases defined in testValues
// use a hypothetical viewport of size 320x568
// and a hypothetical placement of size 320x250
// The scenarios it runs are:
// 1. Scroll placement 3/4 off the top of the screen
// 2. Scroll placement to center of screen
// 3. Scroll placement to 3/4 off the bottom of the screen
// 4. Scroll placement to center of screen
// 5. Scroll placement to 3/4 off the left side of the screen
// 6. Scroll placement to center of screen
// 7. Scroll placement to 3/4 off the right side of the screen
var testValues = [
    {
        exposedPercentage: 25,
        visibleRectangle: {
            x: 0,
            y: 0,
            width: 320,
            height: 62.5
        },
        occlusionRectangles: null
    },
    {
        exposedPercentage: 100,
        visibleRectangle: {
            x: 0,
            y: 159,
            width: 320,
            height: 250
        },
        occlusionRectangles: null
    },
    {
        exposedPercentage: 25,
        visibleRectangle: {
            x: 0,
            y: 505.5,
            width: 320,
            height: 62.5
        },
        occlusionRectangles: null
    },
    {
        exposedPercentage: 100,
        visibleRectangle: {
            x: 0,
            y: 159,
            width: 320,
            height: 250
        },
        occlusionRectangles: null
    },
    {
        exposedPercentage: 25,
        visibleRectangle: {
            x: 0,
            y: 159,
            width: 80,
            height: 250
        },
        occlusionRectangles: null
    },
    {
        exposedPercentage: 100,
        visibleRectangle: {
            x: 0,
            y: 159,
            width: 320,
            height: 250
        },
        occlusionRectangles: null
    },
    {
        exposedPercentage: 25,
        visibleRectangle: {
            x: 240,
            y: 159,
            width: 80,
            height: 250
        },
        occlusionRectangles: null
    }
];

var runExposureChangeTests = function(){
    testValues.forEach(function(testValue){
        mraid.emit("exposureChange", testValue.exposedPercentage, testValue.visibleRectangle, testValue.occlusionRectangles);
    });
};