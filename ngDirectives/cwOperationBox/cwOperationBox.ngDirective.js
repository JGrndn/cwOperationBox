/*global cwAPI, jQuery*/
(function (cwApi, $) {
    'use strict';
    var loader = cwApi.CwAngularLoader;
    if (cwApi.ngDirectives) {
        cwApi.ngDirectives.push(function () {
            loader.registerDirective('cwoperationbox', ['$http', function ($http) {
                function getPopoutName(item) {
                    return item.objectTypeScriptName + '_diagram_popout';
                }

                return {
                    restrict: 'A',
                    templateUrl: loader.getDirectiveTemplatePath('cwTest', 'cwOperationBox'),
                    scope: {
                        item:'=data',
                        url:'@'
                    },
                    link: function ($scope) {
                        var evodUrl = $scope.url;//'http://localhost:20006/';
                        var url = evodUrl + 'executeoperation/' + cwApi.cwConfigs.ModelFilename.toLowerCase() + '/' + $scope.item.object_id;
                        $scope.openPopout = function () {
                            if (!cwApi.isUndefined($scope.item)){
                                cwApi.cwDiagramPopoutHelper.openDiagramPopout($scope.item, getPopoutName($scope.item));
                            }
                        };
                        $scope.executeOperation = function(){
                            if (!cwApi.isUndefined($scope.item)) {
                                $scope.item.response = {
                                    status: 'pending', message: ''
                                };
                                return $http.get(url).then(
                                    function (response) {
                                        $scope.item.response.hasEnded = true;
                                        $scope.item.response.hasPopout = cwApi.ViewSchemaManager.pageExists(getPopoutName($scope.item));
                                        if (!cwApi.statusIsKo(response.data)) {
                                            $scope.item.response.status = 'success';
                                        } else {
                                            $scope.item.response.status = 'failure';
                                            $scope.item.response.message = response.data.result;
                                        }
                                    },
                                    function (response) {
                                        $scope.item.response.hasEnded = true;
                                        $scope.item.response.hasPopout = cwApi.ViewSchemaManager.pageExists(getPopoutName($scope.item));
                                        $scope.item.response.status = 'failure';
                                        $scope.item.response.message = response.statusText ? response.statusText : $.i18n.prop('evod_notreachable');
                                    }
                                );
                            }
                        };
                    }
                };
            }]);
        });
    }

}(cwAPI, jQuery));