var symDigitalBar;
var symbol;
var elem;
var Configuration = {
  DataShape: 'Trend',
  Height: 200,
  Width: 800
}

// Test for Ba:Phase.1
var configuration = {
  "Top": 70,
  "Left": 33,
  "DataShape": "Trend",
  "Height": 200,
  "Width": 800,
  "Multistates": [
    {
      "IsDigitalSet": true,
      "IsDynamicLimit": false,
      "StateVariables": [
        "MultistateColor"
      ],
      "ErrorStateValues": [
        "red",
        false
      ],
      "DefaultStateValues": [
        null
      ],
      "States": [
        {
          "StateValues": [
            "white",
            false
          ],
          "UpperValue": 0,
          "Name": "Phase1"
        },
        {
          "StateValues": [
            "orange",
            false
          ],
          "UpperValue": 1,
          "Name": "Phase2"
        },
        {
          "StateValues": [
            "chartreuse",
            false
          ],
          "UpperValue": 2,
          "Name": "Phase3"
        },
        {
          "StateValues": [
            "blue",
            false
          ],
          "UpperValue": 3,
          "Name": "Phase4"
        },
        {
          "StateValues": [
            "cyan",
            false
          ],
          "UpperValue": 4,
          "Name": "Phase5"
        },
        {
          "StateValues": [
            "magenta",
            false
          ],
          "UpperValue": 5,
          "Name": "Phase6"
        },
        {
          "StateValues": [
            "yellow",
            false
          ],
          "UpperValue": 6,
          "Name": "Phase7"
        },
        {
          "StateValues": [
            "Purple",
            false
          ],
          "UpperValue": 7,
          "Name": "Phase8"
        }
      ]
    }
  ]
}

var FlatLine = {
  "Traces": [
    {
      "Value": "Phase3",
      "LineSegments": [
        "0,28.57 100,28.57"
      ]
    }
  ],
  "StartTime": "8/29/2020 12:10:08 PM",
  "EndTime": "8/29/2020 12:10:39 PM",
  "ValueScalePositions": [
    0,
    14.29,
    28.57,
    42.86,
    57.14,
    71.43,
    85.71,
    100
  ],
  "ValueScaleLabels": [
    "Phase1",
    "Phase2",
    "Phase3",
    "Phase4",
    "Phase5",
    "Phase6",
    "Phase7",
    "Phase8"
  ],
  "ValueScaleLimits": [
    0,
    7
  ],
  "IsUpdating": false,
  "SymbolName": "Symbol0"
}

const badData = {
  "Traces": [
    {
      "Value": "Phase3",
      "ErrorPoints": "35.63,33.33 39.52,66.67 49.97,100 58.39,16.67",
      "LineSegments": [
        "0,33.33 3.66,33.33 3.66,50 7.97,50 7.97,66.67 12.27,66.67 12.27,83.33 14.32,83.33 14.32,100 16.78,100 16.78,0 24.77,0 24.77,16.67 27.64,16.67 27.64,33.33 35.63,33.33",
        "39.52,66.67 43.83,66.67 43.83,83.33 45.67,83.33 45.67,100 49.97,100",
        "58.39,16.67 61.16,16.67 61.16,33.33 70.26,33.33 70.26,50 74.36,50 74.36,66.67 78.66,66.67 78.66,83.33 80.51,83.33 80.51,100 83.38,100 83.38,0 91.57,0 91.57,16.67 94.65,16.67 94.65,33.33 100,33.33"
      ]
    }
  ],
  "StartTime": "9/5/2020 4:59:33 AM",
  "EndTime": "9/5/2020 9:03:33 AM",
  "ValueScalePositions": [
    0,
    16.67,
    33.33,
    50,
    66.67,
    83.33,
    100
  ],
  "ValueScaleLabels": [
    "Phase1",
    "Phase2",
    "Phase3",
    "Phase4",
    "Phase5",
    "Phase6",
    "Phase7"
  ],
  "ValueScaleLimits": [
    0,
    6
  ],
  "IsUpdating": false,
  "SymbolName": "Symbol1",
  "MSValues": {
    "MultistateColor": "chartreuse"
  }
}

var scope = {
  runtimeData: { labelOptions: { length: 4 } },
  config: Configuration
};

describe("sym-DigitalBar", function () {
  elem = document.getElementsByClassName("symbol")[0];
  elem.find = function (className) {
    return document.getElementsByClassName(className.replace(".", ""));
  };

  /*
  it("init: verify size configuration", function () {
    symbol.prototype.init(scope, elem);
    symbol.prototype.onResize(1, 1);
    expect(scope.canvas.width).toEqual(1);
    expect(scope.canvas.height).toEqual(200);
  });*/


  // verify two canvases 
  function isMatch(context1, context2) {
    var image2 = context2.getImageData(0, 0, context1.canvas.width, context1.canvas.width);
    var data2 = image2.data;

    var image1 = context1.getImageData(0, 0,context2.canvas.width, context2.canvas.width);
    var data1 = image1.data;

    console.log(data1);
    console.log(data2);
    for (var i = 0; i < data1.length; i++) {
      if (data1[i] != data2[i]) return false;
    }
    return true;
  }

  it("init: if there is only one value, then the color of the graph should all be one color", function () {
    // create a canvas of a solid color
    symbol.prototype.init(scope, elem);
    symbol.prototype.onDataUpdate(FlatLine);
    symbol.prototype.onConfigChange(Configuration);
    symbol.prototype.onResize(1, 1);

    var testLocation = document.getElementById("testLocation");
    var canvaselement = document.createElement("canvas");
    canvaselement.setAttribute('id', "tempCanvas");
    testLocation.appendChild(canvaselement);

    context = canvaselement.getContext("2d");
    context.canvas.width = 1;
    context.canvas.height = 1;
    context.fillStyle = "chartreuse";
    context.fillRect(0, 0, 100, 100);
    console.log(isMatch(scope.context, context));

    expect(isMatch(scope.context, context)).toEqual(true);

  });
});

