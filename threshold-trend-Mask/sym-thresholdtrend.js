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
        StateVariables: ['MultistateColor'],
        configOptions: function () {
            return [{
                title: 'Configure Threshold Trend',
                mode: 'formatWindArrow'
            }];
        }
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

            scope.ctx.fillStyle = scope.errorColor;
            scope.ctx.fillRect(0, 0, scope.ctx.canvas.width*scope.fudgeWidth, scope.ctx.canvas.height*scope.fudgeHeight);

            var globaltresholdsraw = scope.latestData.Traces.slice(1, scope.latestData.Traces.length);
            var globaltresholds = globaltresholdsraw.map(thresholds => thresholds.LineSegments[0].split(" ").map(word => word.split(',')));

            for (var globalIndex = 1; globalIndex < globaltresholds.length; globalIndex++) {
                scope.ctx.fillStyle = scope.colors[globalIndex];
              
                // draw the polygon by starting from the bottom, and the the top
                scope.ctx.beginPath();
                scope.ctx.moveTo(globaltresholds[globalIndex-1][0][0], globaltresholds[globalIndex-1][0][1]);
                globaltresholds[globalIndex - 1].forEach(point => scope.ctx.lineTo(point[0], point[1]));

                globaltresholds[globalIndex].slice().reverse().forEach(point => scope.ctx.lineTo(point[0], point[1]));
                scope.ctx.closePath();
                scope.ctx.fill();
              }
              scope.ctx.restore();
        }

        function drawCurve() {
            // TODO: Deal with bad data by looping over multiple linesegements
            var points = scope.latestData.Traces[0].LineSegments[0].split(" ").map(p => p.split(','));
            scope.ctx.setLineDash([]);
            scope.ctx.strokeStyle = "white";
            scope.ctx.lineWidth = 0.1;            
            scope.ctx.beginPath();
            scope.ctx.moveTo(points[0][0], points[0][1]);
            points.forEach(point => scope.ctx.lineTo(point[0], point[1]));
            scope.ctx.stroke();
            scope.ctx.closePath();
        }

        function draw() {
            //Cear the shadow of past equations
            scope.ctx.clearRect(0, 0, Math.max(scope.width, 100), scope.height*scope.fudgeHeight);
            drawCurve()
            if (scope.symbol.DataSources.length > 1) {
                drawColors();
            }
        }

        function onDataUpdate(newData) {
            if (!newData) {
                return;
            }
            scope.latestData = newData;
            draw();
        }

       // Process configuration changes 
       function onConfigChange(newConfig) {
            if (scope.symbol.DataSources.length == 1 && scope.symbol.Configuration.Multistates) {
                scope.symbol.DataSources.push(scope.symbol.DataSources[0] + "|" + "Minimum");
                newConfig.Multistates[0].States.forEach(
                    state => scope.symbol.DataSources.push(scope.symbol.DataSources[0] + "|" + state.Label)
                );
            }

            if (scope.symbol.Configuration.Multistates) {
                scope.colors = [];
                scope.symbol.Configuration.Multistates[0].States.forEach(state => scope.colors.push(state.StateValues[0]));
                scope.errorColor = newConfig.Multistates[0].ErrorStateValues[0];
            }   
        }

        function onResize(width, height) {            
            scope.height = height;
            scope.width = width;

            scope.fudgeHeight = Math.max(1, 1/(height*0.01));
            scope.fudgeWidth = Math.max(1, 1/(width*0.01));
            scope.ctx.canvas.width = width;
            scope.ctx.canvas.height = height;
            
            scope.ctx.translate(0, scope.canvas.height);
            scope.ctx.scale(width*0.01, -1*height*0.01);
    
            clearTimeout(scope.redrawit);
            scope.redrawit = setTimeout(draw, 100);
        }
    };  
	PV.symbolCatalog.register(definition); 
})(window.PIVisualization); 