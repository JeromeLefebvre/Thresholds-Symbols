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
            "Purple!",
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



var scope = {
    runtimeData: {labelOptions: {length: 4}},
    config: Configuration
};

describe("sym-DigitalBar", function() {
  elem = document.getElementsByClassName("symbol")[0];
  elem.find = function (className) {
      return document.getElementsByClassName(className.replace(".", ""));
  };
  
  it("init: verify size configuration", function() {
      symbol.prototype.init(scope, elem);
      expect(scope.canvas.width).toEqual(800);
      expect(scope.canvas.height).toEqual(200);
  });

  it("init: if there is only one value, then the color of the graph should all be one color", function() {
    // create a canvas of a solid color
    symbol.prototype.init(scope, elem);
    symbol.prototype.onConfigChange(Configuration);
    console.log(scope.colors);
  });

  /*
Talk to andrew about
* the order of methods called against a custom symbol, when created and when brought from memory
* Talk about what is stored in memory
  */
  /*
  var canvas = document.createElement('canvas');
canvas.width = 500;
canvas.height = 400;

// Get the drawing context
var ctx = canvas.getContext('2d');

// Then you can do stuff, e.g.:
ctx.fillStyle = '#f00';
ctx.fillRect(20,10,80,50);
*/
});

