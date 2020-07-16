/*
Warning:
* The symbol does not work if the multistate is not defined by the attribute limits
* The symbol only works if the data are floats or ints, not string data or digital sets, nor does it handle shutdowns/no data type of values
*/

(function (PV) {
	'use strict';

	function symbolVis() { }
    PV.deriveVisualizationFromBase(symbolVis);

    var definition = {
        typeName: 'thresholdtrend',
        visObjectType: symbolVis,
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,
        supportsCollections: true,
        //iconUrl: 'scripts/app/editor/symbols/ext/icons/sym-thresholdtrend.png', // TODO: Find a logo
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

        // use elem to grab the appropriate canvas
        scope.canvas = elem.find(".thresholdtrend")[0];
        scope.ctx = scope.canvas.getContext("2d");
        scope.redrawit;

        this.onDataUpdate = onDataUpdate;
        this.onResize = onResize;
        this.onConfigChange = onConfigChange;


        function drawColors() {
            // TODO: Use save/restore instead of storing into a variable
            var previousComp = scope.ctx.globalCompositeOperation;
            
            scope.ctx.globalCompositeOperation = "source-atop";

            scope.ctx.fillStyle = scope.errorColor;
            scope.ctx.fillRect(0, 0, scope.ctx.canvas.width*scope.fudgeWidth, scope.ctx.canvas.height*scope.fudgeHeight);
            var globaltresholdsraw = scope.latestData.Traces.slice(1, scope.latestData.Traces.length);
            var globaltresholds = globaltresholdsraw.map(thresholds => thresholds.LineSegments[0].split(" ").map(word => word.split(',')));

            var xes = [];
            for (var i = 0; i < globaltresholds.length; i++) {
                for (var j = 0; j < globaltresholds[i].length; j++) {
                    var x = globaltresholds[i][j][0];
                    if (!xes.includes(x)) {
                        xes.push(x);
                        if (x != 0 && x != 100) {
                            xes.push(x);
                        }
                    }
                }
            }
            xes.sort((a,b) => parseFloat(a) - parseFloat(b));

            var newglobaltresholds = [];
            for (var i = 0; i < globaltresholds.length; i++) {
                var newThreshold = [];
                var k = 0; 
                var thresholds = globaltresholds[i];

                for (var j = 0; j < xes.length; j++) {
                    if ( xes[j] ==  thresholds[k][0]) {
                        newThreshold.push([xes[j], thresholds[k][1]]);
                        k++;
                    }
                    else {
                        newThreshold.push([xes[j], thresholds[k][1]]);
                    }
                }
                newglobaltresholds.push(newThreshold);
            }
            globaltresholds = newglobaltresholds;
            for (var globalIndex = 1; globalIndex < globaltresholds.length; globalIndex++) {
                scope.ctx.fillStyle = scope.colors[globalIndex-1];
                for (var pointIndex = 0; pointIndex < globaltresholds[globalIndex].length - 1; pointIndex++) {
                    var x = globaltresholds[globalIndex - 1][pointIndex][0];
                    var y = globaltresholds[globalIndex - 1][pointIndex][1];
                    var width = globaltresholds[globalIndex][pointIndex + 1][0] - globaltresholds[globalIndex][pointIndex][0];
                    var height = globaltresholds[globalIndex][pointIndex][1] - globaltresholds[globalIndex-1][pointIndex][1];
                    scope.ctx.fillRect(x, y, width*scope.fudgeWidth, height*scope.fudgeHeight);
                }
            }
            scope.ctx.globalCompositeOperation = previousComp;
        }


        function drawCurve() {
            // TODO: Deal with bad data by looping over multiple linesegements
            var points = scope.latestData.Traces[0].LineSegments[0].split(" ").map(p => p.split(','));
            scope.ctx.setLineDash([]);
            scope.ctx.strokeStyle = "white";
            scope.ctx.lineWidth = 0.5;            
            scope.ctx.beginPath();
            for (var i = 0; i < points.length - 1; i++) {
                scope.ctx.moveTo(points[i][0], points[i][1]);
                scope.ctx.lineTo(points[i + 1][0], points[i + 1][1]);
            }
            scope.ctx.stroke();
        }

        function draw() {
            //Cear the shadow of past equations
            //scope.ctx.clearRect(0, 0, scope.canvas.width, scope.canvas.height);
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

        // Process symbol resize
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