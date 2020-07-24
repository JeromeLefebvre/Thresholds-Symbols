(function (PV) {
	'use strict';
	function symbolVis() { }
    PV.deriveVisualizationFromBase(symbolVis);

    var definition = {
        typeName: 'thresholdbar',
        visObjectType: symbolVis,
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,
        supportsCollections: true,
        inject: ['displayProvider', '$rootScope'],
        iconUrl: 'scripts/app/editor/symbols/ext/icons/sym-thresholdlabel.png',
        getDefaultConfig: function () {
            return {
                DataShape: 'Trend',
                Height: 200,
                Width: 800
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

    symbolVis.prototype.init = function (scope, elem, displayProvider, $rootScope) {
        // forces the current value symbol to include the limits
        
        this.onDataUpdate = onDataUpdate;
        this.onResize = onResize;
        this.onConfigChange = onConfigChange;

        scope.canvas = elem.find(".thresholdbar")[0];
        scope.ctx = scope.canvas.getContext("2d");

        function onDataUpdate(newData) {
            if (!newData) {
                return;
            }

            if (scope.IsDynamicLimit) {
                var points = scope.latestData.Traces[0].LineSegments[0].split(" ").map(p => p.split(','));
                for (var i = 0; i < points.length - 1; i++) {
                    var x = points[i][0];
                    var y = 0;
                    var width = (points[i+1][0] - points[i][0])*scope.fudgeWidth;
                    var height = scope.height*scope.fudgeHeight;
                    scope.ctx.fillStyle = scope.colors[points[i][1]];
                    scope.ctx.fillRect(x, y, width, height);
                }
            }
            /*
            if (newData.Limits) {
                for (var i = 2; i < newData.Limits.length; i++) {
                    scope.colors[i-2].text = "".concat(newData.Limits[i-1].Value, "~", newData.Limits[i].Value);
                }
            }
            if (!newData.Limits && scope.IsDynamicLimit) {
                displayProvider.SymbolIncludeLimits = scope.symbol.Name;
                $rootScope.$broadcast('refreshDataForAllSymbols'); 
            }*/

        }

       // Process configuration changes 
       function onConfigChange(newConfig) {
            
            if (!scope.symbol.Configuration.Multistates) {
                return;
            }
            if (newConfig.Multistates[0].IsDynamicLimit) {
                scope.IsDynamicLimit = true;
                scope.colors = [];
                scope.symbol.Configuration.Multistates[0].States.forEach(state => scope.colors.push( {color: state.StateValues[0] })  );
                scope.errorColor = newConfig.Multistates[0].ErrorStateValues[0];
            }
            if (newConfig.Multistates[0].IsDigitalSet) {
                scope.colors = {};
                for (var i = 0; i < newConfig.Multistates[0].States.length; i++) {
                    scope.colors[newConfig.Multistates[0].States[i].Name] = newConfig.Multistates[0].States[i].StateValues[0];
                    //scope.colors.push({color :  newConfig.Multistates[0].States[i].StateValues[0], text: newConfig.Multistates[0].States[i].Name});
                }
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
    
            //clearTimeout(scope.redrawit);
            //scope.redrawit = setTimeout(draw, 100);
        }
    };  
	PV.symbolCatalog.register(definition); 
})(window.PIVisualization); 


