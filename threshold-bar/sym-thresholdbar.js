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
            // newData.ValueScaleLabels, phase1
            // newData.ValueScalePositions 0, 17.7
            scope.ctx.fillStyle = "white";
            var points = newData.Traces[0].LineSegments[0].split(" ").map(p => p.split(','));
            for (var i = 0; i < points.length - 1; i++) {
                var x = points[i][0];
                var y = points[i][1];
                var width = (points[i+1][0] - points[i][0]);
                var height = 100;
                if (scope.IsDynamicLimit) {
                    
                    scope.ctx.fillStyle = scope.colors[newData.ValueScalePositions.indexOf(points[i][1])];
                }
                if (scope.IsDigitalSet) {
                    // Translate between position and state
                    var state = newData.ValueScaleLabels[newData.ValueScalePositions.indexOf(parseFloat(y))];
                    scope.ctx.fillStyle = scope.colors[state];
                }
                
                scope.ctx.fillRect(x, 0, width, height);
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
            scope.IsDynamicLimit = newConfig.Multistates[0].IsDynamicLimit;
            scope.IsDigitalSet = newConfig.Multistates[0].IsDigitalSet;

            if (scope.IsDynamicLimit) {
                scope.colors = [];
                scope.symbol.Configuration.Multistates[0].States.forEach(state => scope.colors.push( {color: state.StateValues[0] })  );
                scope.errorColor = newConfig.Multistates[0].ErrorStateValues[0];
            }
            else if (scope.IsDigitalSet) {
                scope.colors = {};
                for (var i = 0; i < newConfig.Multistates[0].States.length; i++) {
                    scope.colors[newConfig.Multistates[0].States[i].Name] = newConfig.Multistates[0].States[i].StateValues[0];
                    //scope.colors.push({color :  newConfig.Multistates[0].States[i].StateValues[0], text: newConfig.Multistates[0].States[i].Name});
                }
            }
            else {
                // bounds are manually set
            }
        }

        // Process symbol resize
        function onResize(width, height) {
            scope.height = height;
            scope.width = width;
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


            /*
            How to handle the limit case
            based on: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas

              var data = ctx.getImageData(0, 0, 100, 100); 
  // loop over all columns
  for (var x = 0; x < data.width; x++) {
    maxGreen = 0;
    maxRed = 0;
    maxBlue = 0;
    // loop over all the rows in that colum

    for (var y = 0; y < data.height; y++) {
      maxRed = Math.max(maxRed, data.data[(y * data.width + x) * 4 + 0]);      
      maxGreen = Math.max(maxGreen, data.data[(y * data.width + x) * 4 + 1]);
      maxBlue = Math.max(maxBlue, data.data[(y * data.width + x) * 4 + 2]);
    }
    ctx.fillStyle  = "".concat('rgba(', maxRed, ",", maxGreen, ",", maxBlue, ",", 1, ')');
    ctx.fillRect(x, 0, 1, 100);
    */