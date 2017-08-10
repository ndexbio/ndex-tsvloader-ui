var app = angular.module('myApp');

app.directive('importPlanBuckets', function() {
    function link(scope, el, attrs) {
        scope.info = {
            prefix_selected: "",
            prefixes: ["genecard","Kegg"]
        }

        scope.onDropCompleteInner = function(parmData, parmEvent, planElementType){
            scope.onDropComplete({data: parmData, evt: parmEvent, planType: scope.planType, planElementType: planElementType});
            //console.log("In drop");
        };
    }
    return {
        scope: {
            planData:"=",
            planDataDisplay:"=",
            planType:"=",
            onDropComplete:"&",
            contexts: "="
        },
        restrict: "EA",
        templateUrl: "partials/directives/importPlanBuckets.html",
        link: link
    };
});

app.directive('importEdgeBuckets', function() {
    function link(scope, el, attrs) {
        scope.info = {
            prefix_selected: "",
            prefixes: ["genecard","Kegg"]
        }

        scope.onDropCompleteInner = function(parmData, parmEvent, planElementType){
            scope.onDropComplete({data: parmData, evt: parmEvent, planType: scope.planType, planElementType: planElementType});
            //console.log("In drop");
        };
    }
    return {
        scope: {
            planData:"=",
            planDataDisplay:"=",
            planType:"=",
            onDropComplete:"&",
            contexts: "="
        },
        restrict: "EA",
        templateUrl: "partials/directives/importEdgeBuckets.html",
        link: link
    };
});

app.directive('graphPreview', function($timeout) {
    function link(scope, el, attrs) {
        scope.ready = false;
        scope.info = {
            TermId: "",
            previewNetwork: {nodes: [], edges: []},
            cursorWait: false
        };

        scope.allNodes = null;

        scope.$watch('previewSource', function() {
            if(scope.ready){
                if(scope.previewSource.length > 20){
                    scope.allNodes[1].label = scope.previewSource.substr(0,20) + "..."; // + "... [" + scope.previewSourceColumn + "]";
                } else {
                    scope.allNodes[1].label = scope.previewSource; // + " (" + scope.previewSourceColumn + ")";
                }

                var updateArray = [];
                if (scope.allNodes.hasOwnProperty(1)) {
                    updateArray.push(scope.allNodes[1]);
                }

                scope.nodes.update(updateArray);
            }
        });

        scope.$watch('previewTarget', function() {
            if(scope.ready){
                if(scope.previewTarget.length > 20){
                    scope.allNodes[2].label = scope.previewTarget.substr(0,20) + "..."; // + "... [" + scope.previewSourceColumn + "]";
                } else {
                    scope.allNodes[2].label = scope.previewTarget; // + " (" + scope.previewSourceColumn + ")";
                }

                var updateArray = [];
                if (scope.allNodes.hasOwnProperty(2)) {
                    updateArray.push(scope.allNodes[2]);
                }

                scope.nodes.update(updateArray);
            }
        });

        var nodeArray = [];
        var edgeArray = [];

        nodeArray.push({id: 1, label: "SOURCE", font: {size: 20}, borderWidth: 4,
            color: {'background': "#13FFFF", 'border': '#2400FF'}, x: -150, y: 0,
            shape: "square", size: 20, permaSize: 20, nodeDegree: 20});

        nodeArray.push({id: 2, label: "TARGET", font: {size: 20}, borderWidth: 4,
            color: {'background': "#57FF00", 'border': '#2400FF'}, x: 150, y: 0,
            shape: "dot", size: 20, permaSize: 20, nodeDegree: 20});

        nodeArray.push({id: 3, label: "PREVIEW", font: {size: 26, color: '#146C8E'}, borderWidth: 0,
            color: {'background': "#57FF00", 'border': '#2400FF'}, x: 0, y: -25,
            shape: "text", size: 20, permaSize: 20, nodeDegree: 20});

        //===============================
        // nodes for setting boundaries
        //===============================
        nodeArray.push({id: 90, label: "", font: {size: 20, color: "#C0C0C0"}, borderWidth: 0,
            color: {'background': "#FFFFFF", 'border': '#FFFFFF'}, x: -195, y:40,
            shape: "dot", size: 0, permaSize: 5, nodeDegree: 20});
        nodeArray.push({id: 91, label: "", font: {size: 20, color: "#C0C0C0"}, borderWidth: 0,
            color: {'background': "#FFFFFF", 'border': '#FFFFFF'}, x: -195, y:-40,
            shape: "dot", size: 0, permaSize: 5, nodeDegree: 20});
        nodeArray.push({id: 92, label: "", font: {size: 20, color: "#C0C0C0"}, borderWidth: 0,
            color: {'background': "#FFFFFF", 'border': '#FFFFFF'}, x: 195, y:40,
            shape: "dot", size: 0, permaSize: 5, nodeDegree: 20});
        nodeArray.push({id: 93, label: "", font: {size: 20, color: "#C0C0C0"}, borderWidth: 0,
            color: {'background': "#FFFFFF", 'border': '#FFFFFF'}, x: 195, y:-40,
            shape: "dot", size: 0, permaSize: 5, nodeDegree: 20});

        var edgeArray = [];
        edgeArray.push({from: 1, to: 2, label: "",
            font: {align: 'horizontal', size: 20, background: 'rgba(255,255,255,255)'},
            title: "title", zindex: 1050,
            color: {
                color: "red",
                hover: "black",
                highlight: "yellow",
                opacity: (0.6)//Math.abs(result.links[i].weight) - 0.15)
            },
            hidden: false
        });

        scope.nodes = new vis.DataSet(nodeArray);
        scope.edges = new vis.DataSet(edgeArray);

        scope.nodeArray = nodeArray;
        scope.edgeArray = edgeArray;

        var container = document.getElementById('heatmap');
        var data = {
            edges: scope.edges,
            nodes: scope.nodes
        };

        var options = {
            nodes: {
                borderWidth: 1,
                shape: 'dot',
                margin: 10,
                scaling:{
                    label: {
                        min:10,
                        max:20
                    }
                },
                size: 16
            },
            edges:{
                width: 1.0,
                smooth: {
                    "type": "continuous",
                    "forceDirection": "none",
                    "roundness": 0.15
                },
                physics: true
            },
            layout: {
                improvedLayout:true,
                hierarchical: {
                    enabled:false,
                    levelSeparation: 150,
                    direction: 'UD',   // UD, DU, LR, RL
                    sortMethod: 'hubsize' // hubsize, directed
                },
                randomSeed:780555
            },
            interaction:{
                hideEdgesOnDrag: true,
                tooltipDelay: 5000
            },
            physics: false
        };

        scope.network = new vis.Network(container, data, options);//pre_rendered_options); //vizOptions);

        scope.network.fit();

        scope.allNodes = scope.nodes.get({returnType:"Object"});
        scope.allEdges = scope.edges.get({returnType:"Object"});

        $timeout(function() {
            scope.ready = true;

            console.log(scope.network.getScale());
        }, 500);

        scope.afterDrawing = function (params) {
        };

    }
    return {
        scope: {
            context: "=",
            previewSource: "=",
            previewSourceColumn: "=",
            previewTarget: "=",
            previewEdges: "="
        },
        restrict: "EA",
        templateUrl: "partials/directives/visJSPreview.html",
        link: link
    };
});

