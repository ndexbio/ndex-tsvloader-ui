var app = angular.module('myApp', ['ngRoute', 'ngDraggable']);

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
        .when('/import-plan', {
            templateUrl: 'partials/importPlan.html',
            controller: 'myCtrl'
        })
        .otherwise({
            redirectTo: '/import-plan'
        });
    }]);


app.directive('fileReader', function() {
    return {
        scope: {
            fileReader:"=",
            csvSample:"=",
            fileHeader:"="
        },
        link: function(scope, element) {
            $(element).on('change', function(changeEvent) {
                var files = changeEvent.target.files;
                if (files.length) {
                    var r = new FileReader();
                    r.onload = function(e) {
                        var contents = e.target.result;
                        scope.$apply(function () {

                            var lines = contents.split(/[\r\n]+/g);//'\n');
                            console.log(lines.length);
                            var returnArray = [];
                            var previewLineParsed = [];
                            if(lines.length > 1){
                                previewLineParsed = lines[1].split('\t');
                            }
                            for(var i = 0;i < lines.length;i++){

                                var tabbedData = [];
                                if(i <= 5){
                                    lineParsed = lines[i].split('\t');
                                    for(var j = 0;j < lineParsed.length;j++){
                                        tabbedData.push(lineParsed[j].replace(/(\r\n|\n|\r)/gm,""))
                                        if(i === 0){
                                            //                                            scope.fileHeader[j] = {title: lineParsed[j].replace(/(\r\n|\n|\r)/gm,"", preview: lines[1]), selected: false}

                                            scope.fileHeader[j] = {title: lineParsed[j].replace(/(\r\n|\n|\r)/gm,""), selected: false, preview: previewLineParsed[j]}
                                        }
                                    }
                                    returnArray.push(tabbedData);
                                    //console.log(lines[i]);
                                } else {
                                    break;
                                }
                            }
                            scope.csvSample = returnArray;

                            scope.fileReader = contents;
                        });
                    };

                  r.readAsText(files[0]);
                }
            });
        }
    };
});

app.filter('cut', function () {
      return function (value, wordwise, max, tail) {
          if (!value) return '';

          max = parseInt(max, 10);
          if (!max) return value;
          if (value.length <= max) return value;

          value = value.substr(0, max);
          if (wordwise) {
              var lastspace = value.lastIndexOf(' ');
              if (lastspace != -1) {
                  value = value.substr(0, lastspace);
              }
          }

          return value + (tail || ' …');
      };
  });

