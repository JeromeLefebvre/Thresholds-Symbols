(function (PV) {
	'use strict';
	function symbolVis() { }
    PV.deriveVisualizationFromBase(symbolVis);

    var definition = {
        typeName: 'thresholdlabel',
        visObjectType: symbolVis,
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,
        supportsCollections: true,
        inject: ['displayProvider', '$rootScope'],
        iconUrl: 'scripts/app/editor/symbols/ext/icons/sym-thresholdlabel.png',
        getDefaultConfig: function () {
            return {
                DataShape: 'Value',
                Height: 200,
                Width: 200
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

        function onDataUpdate(newData) {
            
            if (!newData) {
                return;
            }
            if (newData.Limits) {
                for (var i = 2; i < newData.Limits.length; i++) {
                    scope.colors[i-2].text = "".concat(newData.Limits[i-1].Value, "~", newData.Limits[i].Value);
                }
            }
            if (!newData.Limits && scope.IsDynamicLimit) {
                displayProvider.SymbolIncludeLimits = scope.symbol.Name;
                $rootScope.$broadcast('refreshDataForAllSymbols'); 
            }
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
                scope.colors = [];
                for (var i = 0; i < newConfig.Multistates[0].States.length; i++) {
                    scope.colors.push({color :  newConfig.Multistates[0].States[i].StateValues[0], text: newConfig.Multistates[0].States[i].Name});
                }
            }
        }

        // Process symbol resize
        function onResize(width, height) {
            var label = elem.find('.threshold-label')[0];    
            label.setAttribute("style","width:" + width + "px");
            label.setAttribute("style","height:" + height + "px");
        }
    };  
	PV.symbolCatalog.register(definition); 
})(window.PIVisualization); 


