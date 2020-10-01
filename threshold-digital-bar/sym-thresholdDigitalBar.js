(function (PV) {
    'use strict';
    function symbolVis() { }
    PV.deriveVisualizationFromBase(symbolVis);

    var definition = {
        typeName: 'thresholdDigitalBar',
        visObjectType: symbolVis,
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,
        supportsCollections: true,
        iconUrl: 'scripts/app/editor/symbols/ext/icons/sym-thresholdDigitalBar.png',
        getDefaultConfig: function () {
            return {
                DataShape: 'Trend',
                Height: 200,
                Width: 800
            };
        },
        StateVariables: ['MultistateColor'],
    };

    symbolVis.prototype.init = function (scope, elem) {
        scope.canvas = elem.find(".thresholdbar")[0];
        scope.context = scope.canvas.getContext("2d");
        scope.colors = ["white", "orange", "chartreuse", "blue", "cyan", "magenta", "yellow", "black"];
        scope.data = [];
        scope.badData = [];

        function drawSquares() {
            // Clear the past bar, needed if the configuration uses transparent multi-state.
            scope.context.clearRect(0, 0, 100, 100);

            // draw the bad data           
            scope.context.fillStyle = scope.errorStateColor;
            for (var i = 0; 2 * i < scope.badData.length; i++) {
                scope.context.fillRect(scope.badData[2 * i], 0, scope.badData[2 * i + 1] - scope.badData[2 * i], 100);
            }

            // draw the good data
            scope.data.forEach(segment => {
                for (var i = 0; i < segment.length - 1; i++) {
                    scope.context.fillStyle = scope.usedColors[Math.round(segment[i][1] * (scope.usedColors.length - 1) / 100)];
                    scope.context.fillRect(segment[i][0], 0, segment[i + 1][0] - segment[i][0], 100);
                }
            });
            /*
            for (var j = 0; j < scope.data.length; j++) {
                var segement = scope.data[j];
                for (var i = 0; i < segement.length - 1; i++) {
                    scope.context.fillStyle = scope.usedColors[Math.round(segement[i][1] * (scope.usedColors.length - 1) / 100)];
                    scope.context.fillRect(segement[i][0], 0, segement[i + 1][0] - segement[i][0], 100);
                }
            }
            */
        }

        this.onDataUpdate = function (newData) {
            if (!newData) return;
            scope.badData = newData.Traces[0].ErrorPoints ? newData.Traces[0].ErrorPoints.split(" ").map(p => p.split(',')[0]) : [];

            scope.data = newData.Traces[0].LineSegments.map(
                segement => segement.split(" ").map(
                    p => p.split(',')
                )
            );
            scope.usedColors = newData.ValueScaleLimits ? scope.colors.slice(newData.ValueScaleLimits[0], newData.ValueScaleLimits[1] + 1) : scope.colors;
            drawSquares();
        }

        this.onConfigChange = function (newConfig) {
            if (newConfig.Multistates) {
                scope.colors = newConfig.Multistates[0].States.map(state => state.StateValues[0]);
                if (newConfig.Multistates[0].ErrorStateValues) {
                    scope.errorStateColor = newConfig.Multistates[0].ErrorStateValues[0];
                }
            }
        }

        this.onResize = function (width, height) {
            scope.canvas.width = width;
            scope.canvas.height = height;
            scope.context.scale(width * 0.01, height * 0.01);
            drawSquares();
        }
    };
    PV.symbolCatalog.register(definition);
})(window.PIVisualization); 