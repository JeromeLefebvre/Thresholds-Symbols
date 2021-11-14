(function(PV) {
    'use strict';

    function symbolVis() {}
    PV.deriveVisualizationFromBase(symbolVis);

    var definition = {
        typeName: 'csv',
        visObjectType: symbolVis,
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,
        supportsCollections: true,
        iconUrl: 'scripts/app/editor/symbols/ext/icons/sym-CSV.svg',
        resizerMode: 'AutoWidth',
        getDefaultConfig: function() {
            return {
                DataShape: 'TimeSeries',
                Height: 60,
                Width: 300,
                Intervals: 100000
            };
        }
    };

    symbolVis.prototype.init = function(scope, elem) {
        scope.label = "Loading";

        //scope.tag = elem.find('.CSVDownload')[0];
        this.onDataUpdate = onDataUpdate;
        this.onResize = onResize;
        this.onConfigChange = onConfigChange;

        function CSVasHREF(values) {
            href = "data:application/csv;charset=utf-8," + encodeURI("TimeStamp,Value\n");
            // add in all other values
            values.forEach(value => {
                href += encodeURI(`${value.Time},${value.Value}\n`);
            });
            return href;
        }

        function onDataUpdate(newData) {
            if (!newData) {
                return;
            }

            if (newData.Data[0].Label !== undefined) {
                scope.Label = newData.Data[0].Label;
                scope.path = newData.Data[0].Path.replace('af:', '').replace('\\', '\\\\');

                //console.log(scope.tag.getBoundingClientRect().x);
                //console.log(scope.tag.getBoundingClientRect().y);
            }

            // add in the uri definition and CSV header
            scope.href = CSVasHREF(values);

            var req = {
                method: 'POST',
                url: 'https://localhost/piwebapi/batch',
                headers: {
                    'Authorization': 'Basic b3NpXGpsZWZlYnZyZToyMDIwMTAwMUV2aWRlbmNlIQ==',
                    'Content-Type': 'application/json'
                },
                data: {
                    "getAttribute": {
                        "Method": "GET",
                        "Resource": "https://localhost/piwebapi/attributes?path=\\\\JLEFEBVRE7390\\Visy\\Roll1|Actual GSM&selectedFields=Links.InterpolatedData"
                    },
                    "getInterpolated": {
                        "Method": "GET",
                        "Resource": "{0}?StartTime=T-1d&EndTime=T&interval=1h&selectedFields=Items.Timestamp;Items.Value",
                        "ParentIds": ["getAttribute"],
                        "Parameters": ["$.getAttribute.Content.Links.InterpolatedData"]
                    }
                }
            }
            $http(req).then(function successCallback(response) {
                console.log(response);
            });


        }

        // Process configuration changes 
        function onConfigChange(newConfig, oldConfig) {
            console.log("new config");
            console.log(newConfig);
            console.log(oldConfig);
            con
        }

        // Process symbol resize
        function onResize(width, height) {
            console.log("new size");
        }
    };
    PV.symbolCatalog.register(definition);
})(window.PIVisualization);