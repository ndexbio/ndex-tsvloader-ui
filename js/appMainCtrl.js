var app = angular.module('myApp');

/*
==========================================================================================================
==========================================================================================================
==========================================================================================================
==========================================================================================================
==========================================================================================================
========================================= MAIN CONTROLLER ================================================
==========================================================================================================
==========================================================================================================
==========================================================================================================
==========================================================================================================
==========================================================================================================
*/

app.controller('myCtrl', ["cxNetworkUtils", "$scope", "$http", "$window", "$log", "$filter", "$location", "$route", "$timeout",
    function (cxNetworkUtils, $scope, $http, $window, $log, $filter, $location, $route, $timeout) {
    $scope.pythonHost = python_host_global; //use variable from env.js

    // Warning: this object gets re-initialized in $scope.clearBoxes()
    $scope.info = {
        message: "MAIN",
        fileHeader: {},
        sp: {source_plan: {}},
        tp: {target_plan: {}},
        ep: {edge_plan: {}},
        cp: {citation_plan: {}},
        context: {},
        dragOk: true,
        contexts: [{tag: "uniprot", selected: false, uri: "http://identifiers.org/uniprot/"},
            {tag: "kegg", selected: false, uri: "http://identifiers.org/keggpathway/"},
            {tag: "GO", selected: false, uri: "http://www.ebi.ac.uk/QuickGO/GTerm?id=GO:"}
        ],
        contextPrefixes: []
    };

    $scope.uiHelper = {
        viewRows: 3
    };

    $scope.saveHelper = {
        savePlan: false
    }

    $scope.graphPreviewInfo = {
        source: {id: 1, title: "Node 1"},
        target: {id: 2, title: "Node 2"},
        edge: {id: 1, title: "Node 1"}
    };

    angular.forEach($scope.info.contexts, function (value, key) {if(value.hasOwnProperty("tag")){this.push(value["tag"]);}
    }, $scope.info.contextPrefixes);

    $scope.searchResults = {
        plans: [],
        selected: "",
        selectedTemplate: {},
        templates: []
    }

    $scope.initSearch = function(){
        console.log("init");

        $http.get('/plans').
        then(function(response) {
            angular.copy(response.data.results, $scope.searchResults.plans);
            //console.log($scope.searchResults.plans);
        });

        $http.get('/templates').
        then(function(response) {
            angular.copy(response.data.results, $scope.searchResults.templates);
            //console.log($scope.searchResults.templates);
        });

    };

    $scope.setNodeTitle = function(){
        $scope.graphPreviewInfo.source = {id: 1, title: "Node 1x"};
    };

    $scope.load_selected_plan = function(){
        if($scope.searchResults.selected){
            var ip = $scope.searchResults.selected.import_plan;
            $scope.showMore.export = true;
            console.log($scope.searchResults.selected);

            //$scope.infoDisplay.sp = {source_plan: ip.source_plan};
            //$scope.infoDisplay.tp = {target_plan:ip.target_plan};
            //$scope.infoDisplay.ep = {edge_plan:ip.edge_plan};
            $scope.infoDisplay.context = {context:ip.context};

            for (var property in ip.source_plan) {
                if (ip.source_plan.hasOwnProperty(property)) {
                    if(property === "property_columns"){
                        for(var i=0; i< ip.source_plan[property].length; i++){
                            $scope.dragAndDropPlan('NODE', property, {title: ip.source_plan[property][i], preview: ""})
                        }
                    } else {
                        $scope.dragAndDropPlan('NODE', property, {title: ip.source_plan[property], preview: ""})
                    }
                }
            }

            for (var property in ip.target_plan) {
                if (ip.target_plan.hasOwnProperty(property)) {
                    if(property === "property_columns"){
                        for(var i=0; i< ip.target_plan[property].length; i++){
                            $scope.dragAndDropPlan('TARGET', property, {title: ip.target_plan[property][i], preview: ""})
                        }
                    } else {
                        $scope.dragAndDropPlan('TARGET', property, {title: ip.target_plan[property], preview: ""})
                    }
                }
            }

            for (var property in ip.edge_plan) {
                if (ip.edge_plan.hasOwnProperty(property)) {
                    if(property === "property_columns"){
                        for(var i=0; i< ip.edge_plan[property].length; i++){
                            $scope.dragAndDropPlan('EDGE', property, {title: ip.edge_plan[property][i], preview: ""})
                        }
                    } else {
                        $scope.dragAndDropPlan('EDGE', property, {title: ip.edge_plan[property], preview: ""})
                    }
                }
            }
        }
    };

    $scope.infoDisplay = {
        sp: {source_plan: {}},
        tp: {target_plan: {}},
        ep: {edge_plan: {}},
        cp: {citation_plan: {}},
        context: {context: {}},
        found_plans: [],
        contexts: []
    };

    $scope.showMore = {
        sp: false,
        tp: false,
        ep: false,
        cp: false,
        export: false,
        sourceTab: "SOURCE"
    };

    $scope.addContext = function(planType){
        $scope.infoDisplay.contexts.push({tag: "", selected: false, uri: ""})
    };

    $scope.contexts = [
        {tag: 'UniProt', selected: false, uri: "http://identifiers.org/uniprot/"},
        {tag: 'DrugBank', selected: false, uri: "http://identifiers.org/drugbank/"},
        {tag: 'Other', selected: false, uri: "http://identifiers.org/other/"}
    ];

    $scope.contextURIs = [
        {tag: 'http://identifiers.org/uniprot/', selected: false},
        {tag: 'http://identifiers.org/drugbank/', selected: false},
        {tag: 'http://identifiers.org/other/', selected: false}
    ];

    $scope.onDropComplete1=function(data, evt, planType, planElementType){
        if(0 === planType.length){
            if($scope.showMore.sourceTab != "CONTEXT"){
                $scope.dragAndDropPlan($scope.showMore.sourceTab, planElementType, data)
            }
        } else {
            $scope.dragAndDropPlan(planType, planElementType, data)
        }
        $scope.showMore.export = true;
        $scope.info.dragOk = true;
    }

    $scope.dragMeStart = function(){
        $scope.info.dragOk = false;
    }

    $scope.clearBoxes = function() {
        $scope.info = {
            message: "MAIN",
            fileHeader: {},
            sp: {source_plan: {}},
            tp: {target_plan: {}},
            ep: {edge_plan: {}},
            cp: {citation_plan: {}},
            dragOk: true,
            contexts: [{tag: "uniprot", selected: false, uri: "http://identifiers.org/uniprot/"},
                {tag: "kegg", selected: false, uri: "http://identifiers.org/keggpathway/"},
                {tag: "GO", selected: false, uri: "http://www.ebi.ac.uk/QuickGO/GTerm?id=GO:"}
            ],
            contextPrefixes: []
        };

        $scope.infoDisplay = {
            sp: {source_plan: {}},
            tp: {target_plan: {}},
            ep: {edge_plan: {}},
            cp: {citation_plan: {}},
            context: {context: {}},
            found_plans: [],
            contexts: []
        };


        angular.forEach($scope.info.contexts, function (value, key) {if(value.hasOwnProperty("tag")){this.push(value["tag"]);}
        }, $scope.info.contextPrefixes);

        $scope.showMore = {
            sp: false,
            tp: false,
            ep: false,
            cp: false,
            export: false
        };
    };

    $scope.addContext = function(context){
        $scope.infoDisplay.context.context[context.tag] = context.uri;
    };

    $scope.setHeaderSelect = function(headerId){
        if(headerId in $scope.info.fileHeader){
            $scope.info.fileHeader[headerId].selected = !$scope.info.fileHeader[headerId].selected;
        }
    };

    $scope.clearSelectedHeader = function(){
        for (var key in $scope.info.fileHeader) {
           if ($scope.info.fileHeader.hasOwnProperty(key)) {
              $scope.info.fileHeader[key].selected = false;
           }
        }

        $scope.clearBoxes();
    };

    $scope.dragAndDropPlan = function(planType, planElementType, data){
        var planTypeObj = null;
        switch(planType) {
            case "SOURCE":
                planTypeObj = $scope.info.sp.source_plan;
                planTypeDisplayObj = $scope.infoDisplay.sp.source_plan;
                break;
            case "TARGET":
                planTypeObj = $scope.info.tp.target_plan;
                planTypeDisplayObj = $scope.infoDisplay.tp.target_plan;
                break;
            case "EDGE":
                planTypeObj = $scope.info.ep.edge_plan;
                planTypeDisplayObj = $scope.infoDisplay.ep.edge_plan;
                break;
            case "CITATION":
                planTypeObj = $scope.info.cp.citation_plan;
                planTypeDisplayObj = $scope.infoDisplay.cp.citation_plan;
                break;
            default:
                planTypeObj = $scope.info.sp.source_plan;
                planTypeDisplayObj = $scope.infoDisplay.sp.source_plan;
        }

        chooseFirstHeaderItem = false;
        if(planElementType != "property_columns"){
            chooseFirstHeaderItem = true;
        }

        if(chooseFirstHeaderItem){
            planTypeObj[planElementType] = data.title;
            planTypeObj[planElementType + "_preview"] = data.preview;
            planTypeDisplayObj[planElementType] = data.title;
        } else {
            if (typeof planTypeObj[planElementType] != 'undefined') {
                if(planTypeObj[planElementType].indexOf(data.title) < 0){
                    planTypeObj[planElementType].push(data.title);
                    planTypeObj[planElementType + "_preview"].push(data.preview);
                    planTypeDisplayObj[planElementType].push(data.title);
                }
            } else {
                planTypeObj[planElementType] =[data.title];
                planTypeObj[planElementType + "_preview"] =[data.preview];
                planTypeDisplayObj[planElementType] =[data.title];
            }
        }
    };

    $scope.setPlan = function(planType, planElementType, data){
        var planTypeObj = null;
        switch(planType) {
            case "SOURCE":
                    planTypeObj = $scope.info.sp.source_plan;
                break;
            case "TARGET":
                planTypeObj = $scope.info.tp.target_plan;
                break;
            case "EDGE":
                planTypeObj = $scope.info.ep.edge_plan;
                break;
            case "CITATION":
                planTypeObj = $scope.info.cp.citation_plan;
                break;
            default:
                planTypeObj = $scope.info.sp.source_plan;
        }

        chooseFirstHeaderItem = false;
        if(planElementType != "property_columns"){
            chooseFirstHeaderItem = true;
        }
        var addTheseItems = [];
        var headerItemFound = true;
        for (var key in $scope.info.fileHeader) {
            if ($scope.info.fileHeader.hasOwnProperty(key)) {
                if ($scope.info.fileHeader[key].selected) {
                    headerItemFound = true;
                    addTheseItems.push($scope.info.fileHeader[key].title);
                }
            }
        }

        if(!headerItemFound){
            addTheseItems.push(null);
        }

        if(chooseFirstHeaderItem){
            planTypeObj[planElementType] = addTheseItems[0];
        } else {
            planTypeObj[planElementType] = addTheseItems;
        }
    };



    $scope.createCXNetwork = function (rawCX, importPlan, onSuccess, onError) {
        //var ndexServerURI = "http://dev.ndexbio.org/v2";
        //var url = ndexServerURI + '/network';
        var ndexServerURI = ""; //"http://localhost:8183";
        var url = ndexServerURI + "/upload?save_plan=" + $scope.saveHelper.savePlan.toString();

        var XHR = new XMLHttpRequest();
        var FD  = new FormData();

        var content = JSON.stringify(rawCX);

        var blob = new Blob([JSON.stringify(importPlan)], { type: "application/octet-stream"});
        var blob2 = new Blob([$scope.fileContent], { type: "text/plain"});

       // data.append("myfile", myBlob, "filename.txt");
        //FD.append('CXNetworkStream', blob);
        FD.append('plan', blob);
        FD.append('upload', blob2);
        FD.append('name', 'Test upload');
        if($scope.searchResults.selectedTemplate.hasOwnProperty('uuid')){
            FD.append('template', $scope.searchResults.selectedTemplate.uuid);
        } else {
            FD.append('template', "");
        }
        FD.append('description', 'Test upload description');

        console.log("here");

        //FD.append('tsvFile', blob2);
        //FD.append('importPlan', blob2);

        XHR.addEventListener('load', function(event) {

            if (XHR.readyState === XHR.DONE) {
                if (XHR.status === 200 || XHR.status === 201) {
                    var newUUID = XHR.responseText;
                    onSuccess(XHR.responseText);
                }
            }
        //    alert('Yeah! Data sent and response loaded.');
        });

        // We define what will happen in case of error
        XHR.addEventListener('error', function(event) {
         //   alert('Oups! Something goes wrong.');
            onError(XHR.responseText);
        });

        XHR.open('POST', url);
        XHR.setRequestHeader("Authorization", "Basic " + btoa("scratch:scratch"));

        // We just send our FormData object, HTTP headers are set automatically
        //var foo =  XHR.send({'files': {"upload": "ABC", "plan": "xyz"}});
        var foo =  XHR.send(FD);

    };


    $scope.loadingSpinner = function(){
        $('#isLoading').html('<span class="fa fa-spinner fa-2x fa-pulse"></span>');
    };


    $scope.exportPlan = function(){
      $('#isLoading').html('<span class="fa fa-spinner fa-2x fa-pulse"></span>');

        var returnJson = {
            source_plan: $scope.infoDisplay.sp.source_plan,
            target_plan: $scope.infoDisplay.tp.target_plan,
            edge_plan: $scope.infoDisplay.ep.edge_plan,
            context: $scope.infoDisplay.context.context
        }

        if($scope.infoDisplay.sp.source_plan){
            console.log($scope.infoDisplay.sp.source_plan);
        }


        var exportArrayString = "data:text/tsv;charset=utf-8,";

        exportArrayString += JSON.stringify(returnJson, null, 4);

        var encodedUri = encodeURI(exportArrayString);

        var network = {
            'preMetaData': { 'metaData': [
              {
                'consistencyGroup': 1,
                'elementCount': 1,
                'idCounter': 66,
                'name': 'nodes',
                'properties': [],
                'version': '1.0'
              },
              {
                'consistencyGroup': 1,
                'elementCount': 2,
                'name': 'networkAttributes',
                'properties': [],
                'version': '1.0'
              }
            ]
            },
            'nodes':{
                "64":
                    {
                        '@id': 64,
                        'n': 'Node 1'
                    }
            },
            'networkAttributes': {
                "elements":
                [
                  {
                    'n': 'name',
                    'v': 'test import plan'
                  },
                  {
                    "n": "importPlan",
                    "v": JSON.stringify(returnJson)
                  }
                ]
            },
            'ndexStatus': {"elements": [
              {
                'error': '',
                'success': true
              }
            ]}
        };




        var rawCX = cxNetworkUtils.niceCXToRawCX(network);

        //               console.log ( JSON.stringify(rawCX));


        //networkService.saveQueryResults(currentNetworkSummary, networkController.currentNetwork, rawCX,

        $scope.createCXNetwork(rawCX, returnJson,
            function (newNetworkURL) {
                $('#isLoading').html('<h3>Done!</h3>');
            },
            function (error) {
                delete $scope.progress;
                $scope.errors = (error && error.message) ? error.message : "Unable to save Query results"
            });




        //window.open(encodedUri);

        console.log(returnJson);

    };






}
]);
