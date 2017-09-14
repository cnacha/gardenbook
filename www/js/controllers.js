/* global angular, document, window */
'use strict';

var defaulturl = 'app.home';
//var URL_PREFIX = 'http://localhost:8888';
var URL_PREFIX = 'https://productserv-158207.appspot.com';

angular.module('starter.controllers', ['ionic','ionic.cloud'])

.factory('methodFactory', function () {
    return { reset: function () {
            console.log("methodFactory - reset");
			window.localStorage.setItem('user', null);
    }
}})

.controller('AppCtrl', function($scope,$rootScope,$ionicPopup, $ionicModal,$ionicLoading, $ionicPopover, $timeout,$state,$http, $cordovaCamera,$cordovaNativeAudio) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;
	$scope.URL_PREFIX = URL_PREFIX;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };
	
	  
	 $rootScope.$on('cloud:push:notification', function(event, data) {
		var msg = data.message;
		
		//alert("message "+msg.title + ': ' + msg.text);
		$rootScope.hasMessage = true;
		console.log("message "+msg.title + ": " + msg.text);
		
		 var alertPopup = $ionicPopup.alert({
			 title: msg.title,
			 template: msg.text,
			  buttons: [
              { text: 'OK',  onTap: function(e) {
					  console.log(e);
					 // $cordovaNativeAudio.stop('alarmClock');
					  return true; 
					} 
			   }
             ]
		  });
		  
		//$scope.messages = msg;
	});
	
	// query news and promotion
	$scope.$on('news:updated', function(event,symptomList) {
		$scope.news = [];
		$scope.promotion = [];
		$scope.urlprefix = URL_PREFIX;
		if(symptomList != null && symptomList.length >0){
			for(var i=0;i<symptomList.length;i++){
				$ionicLoading.show();
				$http.get(URL_PREFIX+"/listNewsByTargetAndLevelWS.do?target="+symptomList[i].symptomName+"&&level="+symptomList[i].symptomlevel)
				.then(function(res){
				//	console.log(JSON.stringify(res.data));
					$scope.news = $scope.news.concat(res.data);
					$ionicLoading.hide();
				}
				, function(err) {
						console.error('ERR', JSON.stringify(err));
				});
			}
			
			for(var i=0;i<symptomList.length;i++){
				$ionicLoading.show();
				$http.get(URL_PREFIX+"/listPromotionByTargetAndLevelWS.do?target="+symptomList[i].symptomName+"&&level="+symptomList[i].symptomlevel)
				.then(function(res){
			//		console.log(JSON.stringify(res.data));
					$scope.promotion = $scope.promotion.concat(res.data);
					$ionicLoading.hide();
				}
				, function(err) {
						console.error('ERR', JSON.stringify(err));
				});
			}
		}
	});
	
	$scope.getTimeStamp = function(){
		return (new Date()).getTime();
	}
})

.controller('LoginCtrl', function($scope,$rootScope, $state, $timeout,$ionicPush, $ionicSideMenuDelegate, $stateParams, ionicMaterialInk, $location, $http, $cordovaOauth, $ionicLoading, $ionicPopup) {
	
	var uObj = window.localStorage.getItem('user');
    console.log('LoginCtrl - Existing user: '+window.localStorage.getItem('user'));
    $timeout(function() {
		if(uObj != 'null'){
				  console.log('this user alraldy login so go to homepage : authorizationKey = '+JSON.parse(uObj).authorizationKey);
				  $http.defaults.headers.common['___authorizationkey'] = JSON.parse(window.localStorage.getItem('user')).authorizationKey;
				  $state.go(defaulturl);
				  return;
		 }
	 }, 100);
	$scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
   }, 0);
	$ionicSideMenuDelegate.canDragContent(false);
    ionicMaterialInk.displayEffect();
	
	$scope.formData = {};
	$scope.formData.role = "user";
	$scope.login = function() {
		$ionicLoading.show();
		var headers = { 'Content-Type':'application/json' };
		$http.post(URL_PREFIX+"/api/security/login.do",JSON.stringify($scope.formData),headers).
			success(function(data, status, headers, config) 
			{
				$ionicLoading.hide();
				console.log("logginedUser "+JSON.stringify(data));
				if(data != ''){
					window.localStorage.setItem('user',JSON.stringify(data));
					
					// Get Device Token Key 
					$ionicPush.register().then(function(t) {
							console.log('Saving token');
							return $ionicPush.saveToken(t);
					}).then(function(t) {
						// Update the latest token key of the user			
						$http.get(URL_PREFIX+"/api/security/pushtoken/save.do?tokenKey="+t.token+"&userId="+data.id)
							.then(function(res) {
								console.log('Update Device Token for '+data.keyString+' success');
							}, function(err) {
								console.error('ERR', JSON.stringify(err));
							}
						); 
						console.log('Token saved:', t.token);
					});
					
					$state.go(defaulturl);
					// set header for authorization key
					$http.defaults.headers.common['___authorizationkey'] = data.authorizationKey;
				}else{
					 var alertPopup = $ionicPopup.alert({
					 title: 'Security Alert',
					 template: 'ชื่อผุ้ใช้ หรือ รหัสผ่าน ไม่ถูกต้อง'
					});

					alertPopup.then(function(res) {
				
					});
				}
				
			}).
			error(function(data, status, headers, config) 
			{
				console.log("error"+JSON.stringify(data));
				$ionicLoading.hide();
			});
	
	}
	
	$scope.register = function() {
		$state.go("app.register");
	}
	
})

.controller('RegisterCtrl', function($scope, $stateParams,$state,$ionicSideMenuDelegate, $timeout,$http,$ionicPopup, ionicMaterialMotion,$ionicLoading, ionicMaterialInk) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
	$ionicSideMenuDelegate.canDragContent(false);
	 $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
	$scope.formData ={};
	$scope.formData.profile ={};
	$scope.submit = function() {
		console.log($scope.formData.password +"<>"+ $scope.repassword);
		if (!$scope.formData.username.match(/^[0-9a-z]+$/) || !$scope.formData.password.match(/^[0-9a-z]+$/)){
			var alertPopup = $ionicPopup.alert({
					 title: 'โปรดตรวจสอบ',
					 template: 'Username และ Password ต้องประกอบไปด้วยตัวเลข ตัวอักษร A-Z ตัวเล็กหรือตัวใหญ่ เท่านั้น'
					});
			alertPopup.then(function(res) {});
			return;
		} else if ($scope.formData.password != $scope.formData.repassword){
			var alertPopup = $ionicPopup.alert({
					 title: 'โปรดตรวจสอบ',
					 template: 'รหัสผ่านที่ใส่ไม่ตรงกัน'
					});
			alertPopup.then(function(res) {});
			return;
		} 

		$ionicLoading.show();
		$scope.formData.role = 'user';
		delete $scope.formData.repassword;
		var headers = { 'Content-Type':'application/json' };
		$http.post(URL_PREFIX+"/api/security/register.do",JSON.stringify($scope.formData),headers).
			success(function(data, status, headers, config) 
			{
				$ionicLoading.hide();
				console.log("success: "+data);
				if(data == "-3"){
					 var alertPopup = $ionicPopup.alert({
					 title: 'Registration Fail',
					 template: 'Username มีผู้ใช้แล้ว <BR/>โปรดใส่ username ใหม่'
					});
					alertPopup.then(function(res) {});
					
				} else if(data == "-4"){
					 var alertPopup = $ionicPopup.alert({
					 title: 'Registration Fail',
					 template: 'รหัสคนไข้(HN) มีผู้ใช้งานอยู่แล้ว <BR/>โปรดใส่รหัสใหม่ หรือ ปล่อยว่างเพื่อสร้างบัญชีผู้ใช้ชั่วคราว'
					});
					alertPopup.then(function(res) {});
					
				} else if(data == "-1") {
					var alertPopup = $ionicPopup.alert({
					 title: 'Registration Fail',
					 template: 'ระบบเกิดความผิดพลาดในระหว่างการลงเบียน โปรดลงทะเบียนใหม่'
					});

					alertPopup.then(function(res) {});
				} else {
					var alertPopup = $ionicPopup.alert({
					 title: 'Registration Success',
					 template: 'การลงทะเบียนสำเร็จ โปรดเข้าระบบด้วย Username และ Password ที่ตั้งไว้'
					});

					alertPopup.then(function(res) {
					 $state.go('app.login');
					});
					//$state.go('app.login');
				}

			}).
			error(function(data, status, headers, config) 
			{
				console.log("error: "+data);
				$ionicLoading.hide();
				
				
			});
	}
	
  
})

.controller("LogoutCtrl",function($scope,$state, $ionicLoading,methodFactory) {
	
		console.log("LogoutCtrl called");
		methodFactory.reset();		
		$state.go('app.login');
		
		
})

.controller('AddPatientCtrl', function($ionicNavBarDelegate,$scope, $stateParams, $timeout, $state,methodFactory, $http,$filter,$ionicPopup, ionicMaterialMotion,$ionicLoading, ionicMaterialInk) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
	$ionicNavBarDelegate.showBackButton(true);

    var userObj = JSON.parse(window.localStorage.getItem('user'));
	
	$scope.searchPatient = function(code){
		$ionicLoading.show();
		var headers = { 'Content-Type':'application/json' };
		$http.get(URL_PREFIX+"/api/patient/securityCode/query.do?code="+code)
					.then(function(res){ 
						$ionicLoading.hide();
						console.log(JSON.stringify(res.data));
						$scope.patientList = res.data;
						$scope.selectPatient = 'true';
					}
					, function(err) {
							console.error('ERR', JSON.stringify(err));
							$ionicLoading.hide();
					}); 
	}
	
	$scope.recordPermit = function(patient){
		$ionicLoading.show();
		var headers = { 'Content-Type':'application/json' };
		console.log("Saving "+JSON.stringify($scope.patientRecord));
		var carepermit = { patientId: patient.id, careGiverId: userObj.referenceObject.id};
		$http.post(URL_PREFIX+"/api/carepermit/save.do",JSON.stringify(carepermit),headers).
				success(function(data, status, headers, config) 
				{
					$ionicLoading.hide();
					console.log("save result"+JSON.stringify(data));
				/**	var alertPopup = $ionicPopup.alert({
						title: 'เพิ่มคนไข้ในความดูแล',
						template: 'การเพิ่มคนไข้ในความดูแลเสร็จสมบูรณ์'
					});
				**/
					$state.go("app.home")
				}).
				error(function(data, status, headers, config) 
				{
					console.log("error"+JSON.stringify(data));
					$ionicLoading.hide();
					var alertPopup = $ionicPopup.alert({
						title: 'เพิ่มคนไข้ในความดูแล',
						template: 'เกิดความผิดพลาดในการเพิ่มคนไข้ในความดูแล'
					});
				});
	}
})
.controller('WelcomeCtrl', function($scope,$rootScope, $window,$ionicActionSheet, $ionicHistory,$ionicNavBarDelegate,$ionicSideMenuDelegate, $stateParams,$ionicPopup, $http,$filter, $timeout, ionicMaterialMotion,$ionicLoading, ionicMaterialInk) {
	console.log("WelcomeCtrl is called");
	// Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
	$ionicNavBarDelegate.showBackButton(false);
	$ionicSideMenuDelegate.canDragContent(true);
	
})

.controller('HomeCtrl', function($scope,$state, $rootScope, $window,$ionicActionSheet, $ionicHistory,$ionicNavBarDelegate,$ionicSideMenuDelegate, $stateParams,$ionicPopup, $http,$filter, $timeout, ionicMaterialMotion,$ionicLoading, ionicMaterialInk,$cordovaCamera,$cordovaFileTransfer,$cordovaDevice,$cordovaFile) {
	
	console.log("HomeCtrl called");
	
	// Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
	$ionicNavBarDelegate.showBackButton(false);
	$ionicSideMenuDelegate.canDragContent(true);
	//$state.go("app.welcome");
	
	
	var userObj = JSON.parse(window.localStorage.getItem('user'));
	$rootScope.firstname = userObj.profile.firstname;
	$rootScope.lastname = userObj.profile.lastname;
	$scope.profile = userObj.profile;
	// calculate age
	
	var ageDifMs = Date.now() - (new Date($scope.profile.birthday)).getTime();
	console.log("ageDifMs "+(ageDifMs/ 31536000000));
    $scope.profile.age = Math.round(ageDifMs/ 31536000000);
	// query health category
	$ionicLoading.show();
	$http.get(URL_PREFIX+"/api/healthsummary/category/list.do?id="+userObj.profile.id)
		.then(function(res){ 
			$ionicLoading.hide();
			console.log(JSON.stringify(res.data));
			$scope.summaryList = res.data;
			var completeCategory = 0;
			for(var i=0; i<$scope.summaryList.length;i++){
				if($scope.summaryList[i].measures.length !=0){
					completeCategory++;
				}
			}
			$scope.dataCompleteness = Math.round((completeCategory/$scope.summaryList.length)*100);
		}
		, function(err) {
				console.error('ERR', JSON.stringify(err));
				$ionicLoading.hide();
		}); 
	
	
	
})


.directive('ionMultipleSelect', ['$ionicModal', '$ionicGesture', function ($ionicModal, $ionicGesture) {
  return {
    restrict: 'E',
    scope: {
      options : "=",
	  coptions : "="
    },
    controller: function ($scope, $element, $attrs, $ionicLoading) {
	console.log("chbx:"+$attrs.renderCheckbox+$attrs.keyProperty);
      $scope.multipleSelect = {
        title:            $attrs.title || "Select Options",
        tempOptions:      [],
        keyProperty:      $attrs.keyProperty || "id",
        valueProperty:    $attrs.valueProperty || "value",
        selectedProperty: $attrs.selectedProperty || "selected",
        templateUrl:      $attrs.templateUrl || 'templates/multipleSelect.html',
        renderCheckbox:   $attrs.renderCheckbox ? $attrs.renderCheckbox == "true" : true,
        animation:        $attrs.animation || 'none'//'slide-in-up'
      };
      $scope.OpenModalFromTemplate = function (templateUrl) {
        $ionicModal.fromTemplateUrl(templateUrl, {
          scope: $scope,
          animation: $scope.multipleSelect.animation
        }).then(function (modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });
      };
      
      $ionicGesture.on('tap', function (e) {
	   $ionicLoading.show();
       $scope.multipleSelect.tempOptions = $scope.options.map(function(option){
         var tempOption = { };
         tempOption[$scope.multipleSelect.keyProperty] = option[$scope.multipleSelect.keyProperty];
         tempOption[$scope.multipleSelect.valueProperty] = option[$scope.multipleSelect.valueProperty];
         tempOption[$scope.multipleSelect.selectedProperty] = option[$scope.multipleSelect.selectedProperty];
     
         return tempOption;
       });
	   $ionicLoading.hide();
        $scope.OpenModalFromTemplate($scope.multipleSelect.templateUrl);
      }, $element);
      
      $scope.saveOptions = function(){
	    if($scope.multipleSelect.renderCheckbox){
			for(var i = 0; i < $scope.multipleSelect.tempOptions.length; i++){
			  var tempOption = $scope.multipleSelect.tempOptions[i];
			  for(var j = 0; j < $scope.options.length; j++){
				var option = $scope.options[j];
				if(tempOption[$scope.multipleSelect.keyProperty] == option[$scope.multipleSelect.keyProperty]){
				  option[$scope.multipleSelect.selectedProperty] = tempOption[$scope.multipleSelect.selectedProperty];
				  break;
				}
			  }
			}
		} else {
			// for radio button

			for(var i = 0; i < $scope.options.length; i++){
				var option = $scope.options[i];
				if(option[$scope.multipleSelect.keyProperty] == $scope.selected){
					  option[$scope.multipleSelect.selectedProperty] = true;
				} else{
					  option[$scope.multipleSelect.selectedProperty] = false;
				}
			}
		   
		}
        $scope.closeModal();
      };
	  
	  $scope.onSelectRadio = function(u){
		console.log("onSelectRadio called: "+u);
		$scope.selected = u;
	  }	
      
      $scope.closeModal = function () {
        $scope.modal.remove();
      };
      $scope.$on('$destroy', function () {
          if ($scope.modal){
              $scope.modal.remove();
          }
      });
    }
  };
}])

;
