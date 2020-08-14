(function (PV) {
	'use strict';
	function symbolVis() { }
    PV.deriveVisualizationFromBase(symbolVis);

    var definition = {
        typeName: 'thresholdDigitalBar',
        visObjectType: symbolVis,
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,
        supportsCollections: true,
        iconUrl: 'scripts/app/editor/symbols/ext/icons/sym-thresholdlabel.png',
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
            for (var i = 0; i < scope.data.length - 1; i++) {
            	scope.context.fillStyle = scope.usedColors[Math.round(scope.data[i][1]*(scope.usedColors.length-1)/100)];
                scope.context.fillRect(scope.data[i][0], 0, scope.data[i+1][0] - scope.data[i][0], 100);
            }
        }
        
        this.onDataUpdate = function(newData) {
            if (!newData) return;
            scope.data = newData.Traces[0].LineSegments[0].split(" ").map(p => p.split(','));
            scope.usedColors = newData.ValueScaleLimits ? scope.colors.slice(newData.ValueScaleLimits[0], newData.ValueScaleLimits[1]+1) : scope.colors;
            drawSquares();
        }

        this.onConfigChange = function(newConfig) {
            scope.colors = newConfig.Multistates ? newConfig.Multistates[0].States.map(state => state.StateValues[0]) : scope.colors;
        }
        
        this.onResize  = function(width, height) {
            scope.canvas.width = width;
            scope.canvas.height = height;
            scope.context.scale(width*0.01, height*0.01);
            drawSquares();
         }
    };  
	PV.symbolCatalog.register(definition); 
})(window.PIVisualization); 