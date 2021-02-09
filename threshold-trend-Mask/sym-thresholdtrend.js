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
            // this assumes that limit 
            //console.info("drawColors")
            scope.ctx.globalCompositeOperation = "source-atop";
            //scope.ctx.globalCompositeOperation = "destination-over";
            scope.ctx.fillStyle = scope.errorColor;
            scope.ctx.fillRect(0, 0, 100, 100);

            for (var globalIndex = 2; globalIndex < scope.globaltresholds.length; globalIndex++) {
                // draw the polygon by starting from the bottom limit
                // asssumes that all the limits are in order i.e. all values of Hi are less or equal than HiHi
                scope.ctx.beginPath();
                let lower = scope.globaltresholds[globalIndex - 1][0];
                console.info(lower[0][0])
                var upper = scope.globaltresholds[globalIndex][0];
                console.info(lower[0][0]);
                lower.reverse()
                console.info(lower[0][0])
                scope.ctx.moveTo(lower[0][0], lower[0][1]);
                lower.forEach(point => scope.ctx.lineTo(point[0], point[1]));

                upper.forEach(point => scope.ctx.lineTo(point[0], point[1]));
                scope.ctx.closePath();
                //scope.ctx.globalCompositeOperation = "destination-over";
                scope.ctx.fillStyle = scope.colors[globalIndex - 2];
                scope.ctx.fill();
            }
            upper.reverse();
        }

        function drawCurve() {
            var lineSegments = scope.globaltresholds[0];

            scope.ctx.globalCompositeOperation = "source-over";
            scope.ctx.lineWidth = 0.2;

            lineSegments.forEach(points => {
                scope.ctx.beginPath();
                scope.ctx.moveTo(points[0][0], points[0][1]);
                points.forEach(point => scope.ctx.lineTo(point[0], point[1]));
                scope.ctx.stroke();
                scope.ctx.closePath();
            });
        }

        function draw() {
            if (!scope.globaltresholds) return;
            scope.ctx.clearRect(0, 0, 100, 100); // Clear the shadow of past equations
            drawCurve()
            if (scope.symbol.DataSources.length > 1) {
                drawColors();
            }
        }

        function onDataUpdate(newData) {
            if (!newData) return;

            scope.globaltresholds = newData.Traces.map(
                thresholds => thresholds.LineSegments.map(lineSegment =>
                    lineSegment.split(" ").map(word => word.split(','))
                )
            );
            
            draw();
        }

        function onConfigChange(newConfig) {
            // the symbol only supports af attribute with dynamic limits
            if (!newConfig || !newConfig.Multistates || !newConfig.Multistates[0].IsDynamicLimit) return;
            var pathData = PV.Utils.parsePath(scope.symbol.DataSources[0]);
            var path = "af:" + PV.Utils.removePersistId(pathData.fullPath);
            // adds the limits as traces as we need to know the values along the path
            if (scope.symbol.DataSources.length == 1) {
                scope.symbol.DataSources.push(path + "|" + newConfig.Multistates[0].LowerValueLabel);
                newConfig.Multistates[0].States.forEach(
                    state => scope.symbol.DataSources.push(path + "|" + state.Label)
                );
            }

            scope.colors = Array.from(scope.symbol.Configuration.Multistates[0].States, state => state.StateValues[0]);
            scope.errorColor = newConfig.Multistates[0].ErrorStateValues[0];


        }

        function onResize(width, height) {
            //console.info(width,height);
            scope.canvas.width = width;
            scope.canvas.height = height;

            // change the coordinates to match the coordinate system of trend symbol
            scope.ctx.translate(0, scope.canvas.height);
            scope.ctx.scale(width * 0.01, -1 * height * 0.01);

            draw();
        }
    };
    PV.symbolCatalog.register(definition);
})(window.PIVisualization);


function onConfigChange(newConfig) {
    if (scope.symbol.DataSources.length == 1) {
        scope.symbol.DataSources.push(path + "|" + newConfig.Multistates[0].LowerValueLabel);
        newConfig.Multistates[0].States.forEach(
            state => scope.symbol.DataSources.push(path + "|" + state.Label)
        );
    }
}