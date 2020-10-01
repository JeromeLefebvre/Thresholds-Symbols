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
        
        function drawSquares() {
            // Clear the past bar, needed if the configuration uses transparent multi-state.
            scope.context.clearRect(0, 0, 100, 100);

            // draw a full square for the bad data and if there is any good data draw on top of it
            scope.context.fillStyle = scope.errorStateColor;
            scope.context.fillRect(0, 0, 100, 100);

            // draw the good data
            scope.data.forEach(segment => {
                for (var i = 0; i < segment.length - 1; i++) {
                    scope.context.fillStyle = scope.usedColors[Math.round(segment[i][1] * (scope.usedColors.length - 1) / 100)];
                    scope.context.fillRect(segment[i][0], 0, segment[i + 1][0] - segment[i][0], 100);
                }
            });
        }

        this.onDataUpdate = function (newData) {
            if (!newData) return;

            scope.data = newData.Traces[0].LineSegments.map(
                segement => segement.split(" ").map(
                    p => p.split(',')
                )
            );
            
            scope.usedColors = newData.ValueScaleLimits ? scope.colors.slice(newData.ValueScaleLimits[0], newData.ValueScaleLimits[1] + 1) : scope.colors;
            drawSquares();
        }

        this.onConfigChange = function (newConfig) {
            if (!newConfig.Multistates) return;

            scope.colors = newConfig.Multistates[0].States.map(state => state.StateValues[0]);
            scope.errorStateColor = newConfig.Multistates[0].ErrorStateValues ? newConfig.Multistates[0].ErrorStateValues[0] : "";
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