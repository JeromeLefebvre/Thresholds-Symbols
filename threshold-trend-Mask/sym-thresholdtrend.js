(function (PV) {
	'use strict';
	function symbolVis() { }
    PV.deriveVisualizationFromBase(symbolVis);
    var definition = {
        typeName: 'thresholdtrend',
        visObjectType: symbolVis,
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,
        supportsCollections: true,
        iconUrl: 'scripts/app/editor/symbols/ext/icons/sym-thresholdtrend.png',
        getDefaultConfig: function () {
            return {
                DataShape: 'Trend',
                Height: 300,
                Width: 500
            };
        },
        StateVariables: ['MultistateColor']
    };
    
    symbolVis.prototype.init = function (scope, elem) {
        scope.canvas = elem.find(".thresholdtrend")[0];
        scope.ctx = scope.canvas.getContext("2d");
        this.onDataUpdate = onDataUpdate;
        this.onResize = onResize;
        this.onConfigChange = onConfigChange;

        function drawColors() {
            scope.ctx.save();
            scope.ctx.globalCompositeOperation = "source-atop";

            scope.ctx.fillStyle = (scope.errorColor) ? scope.errorColor : "red";
            scope.ctx.fillRect(0, 0, 100, 100);
            var globaltresholds = scope.latestData.Traces.map(thresholds => thresholds.LineSegments[0].split(" ").map(word => word.split(',')));

            for (var globalIndex = 2; globalIndex < globaltresholds.length; globalIndex++) {
                // draw the polygon by starting from the bottom limit, and the the top
                scope.ctx.beginPath();
                scope.ctx.moveTo(globaltresholds[globalIndex-1][0][0], globaltresholds[globalIndex-1][0][1]);
                globaltresholds[globalIndex - 1].forEach(point => scope.ctx.lineTo(point[0], point[1]));
                globaltresholds[globalIndex].slice().reverse().forEach(point => scope.ctx.lineTo(point[0], point[1]));
                scope.ctx.closePath();
                scope.ctx.fillStyle = scope.colors[globalIndex-2];                
                scope.ctx.fill();
              }
              scope.ctx.restore();
        }

        function drawCurve() {
            var points = scope.latestData.Traces[0].LineSegments[0].split(" ").map(p => p.split(','));
            scope.ctx.strokeStyle = "white";
            scope.ctx.lineWidth = 0.1;            
            scope.ctx.beginPath();
            scope.ctx.moveTo(points[0][0], points[0][1]);
            points.forEach(point => scope.ctx.lineTo(point[0], point[1]));
            scope.ctx.stroke();
            scope.ctx.closePath();
        }

        function draw() {
            scope.ctx.clearRect(0,0,100,100); // Clear the shadow of past equations
            drawCurve()
            drawColors();
        }

        function onDataUpdate(newData) {
            if (!newData) return;
            scope.latestData = newData;
            draw();
        }

       function onConfigChange(newConfig) {
            // adds the limits as traces as we need to know the values along the path
            if (scope.symbol.DataSources.length == 1 && scope.symbol.Configuration.Multistates) {
                scope.symbol.DataSources.push(scope.symbol.DataSources[0] + "|" + "Minimum");
                newConfig.Multistates[0].States.forEach(
                    state => scope.symbol.DataSources.push(scope.symbol.DataSources[0] + "|" + state.Label)
                );
            }

            if (scope.symbol.Configuration.Multistates) {
                scope.colors = Array.from(scope.symbol.Configuration.Multistates[0].States, state => state.StateValues[0]);
                scope.errorColor = newConfig.Multistates[0].ErrorStateValues[0];
            }   
        }

        function onResize(width, height) {     
            const scale = 0.01;
            const pixelRatio = window.devicePixelRatio || 1;       
            scope.canvas.width = width*pixelRatio;
            scope.canvas.height = height*pixelRatio;

            scope.canvas.style.width = `${width}px`;
            scope.canvas.style.height = `${height}px`;

            scope.ctx.translate(0, scope.canvas.height);
            scope.ctx.scale(width*0.01*pixelRatio, -1*height*0.01*pixelRatio);

            // debouce
            clearTimeout(scope.redrawit);
            if (scope.latestData)
                scope.redrawit = setTimeout(draw, 50);
        }
    };  
	PV.symbolCatalog.register(definition); 
})(window.PIVisualization); 