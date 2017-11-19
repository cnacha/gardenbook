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

.controller('AppCtrl', function($scope,$rootScope,$q,$ionicPopup,$cordovaDevice,$cordovaFile, $ionicModal,$ionicLoading, $ionicPopover, $timeout,$state,$http, $cordovaCamera,$cordovaNativeAudio) {
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
	
	$scope.toImageURL = function(id){
		return URL_PREFIX + "/public/consumption/photo/download.do?id="+id+"&timestamp="+(new Date()).getTime();
	}
	
	$scope.toLongDate = function(dateTxt){
		var date = new Date(dateTxt);
		 var monthNames = [
			"มกราคม", "กุมพาพันธ์", "มีนาคม",
			"เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม",
			"สิงหาคม", "กันยายน", "ตุลาคม",
			"พฤศจิกายน", "ธันวาคม"
		  ];
		  
		  var day = date.getDate();
		  var monthIndex = date.getMonth();
		  var year = date.getFullYear();

		  return day + ' ' + monthNames[monthIndex] + ' ' + year;
	}
	
	$scope.toMealTxt = function(code){
		if(code == 'breakfast')
			return "มื้อเช้า";
		if(code == 'lunch')
			return "มื้อกลางวัน";
		if(code == 'dinner')
			return "มื้อเย็น";
		if(code == 'snack')
			return "มื้ออื่นๆ";
	}
	
	$scope.newrecord = function(){
      $state.go('app.recordConsumption') ;

    }
	
	$scope.toDataURL = function (file) {
		var resolveFile = function(entry) {
			var deferred = $q.defer();
			// first convert to local file system URL
			window.resolveLocalFileSystemURL(entry, function(fileEntry) {
				// now read/convert the file to file object.
				fileEntry.file(function(file) {
					console.log("File converted to file entry");
					deferred.resolve(file);
				}, function(err) {
					console.log("Failed to convert to file entry", err);
					deferred.reject(err);
				});
			}, function(err) {
				console.log("Failed to resolve to file URL", err);
				deferred.reject(err);
			});

			return deferred.promise;
		};
		var onload = function (evt) {
			var encoded = window.btoa(evt.target.result);
			//console.log(encoded);
			$rootScope.imageData = encoded;
			$state.go("app.recordConsumption");
		};
		var fileReader = new FileReader();
		fileReader.onload = onload;
		//fileReader.onprogress = progress;
		resolveFile(file).then(function(actualFile) {
			 fileReader.readAsBinaryString(actualFile);
			
		});
	}
	
	 // take photo for image recognition
	$scope.takeImage = function() {
      console.log("takeImage called");
        var options = {
            quality: 80,
            //destinationType: Camera.DestinationType.DATA_URL,
		    destinationType: Camera.DestinationType.FILE_URI,
            //sourceType: Camera.PictureSourceType.CAMERA,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 800,
            targetHeight: 600,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function(result) {
          console.log("getPicture called " +result);
		  $scope.toDataURL(result)
		   var currentName = result.replace(/^.*[\\\/]/, '');
 
			//Create a new name for the photo
			var d = new Date(),
			n = d.getTime(),
			newFileName =  n + ".jpg";
		 
			// If you are trying to load image from the gallery on Android we need special treatment!
			if ($cordovaDevice.getPlatform() == 'Android' ) {
			    window.FilePath.resolveNativePath(result, function(entry) {
				window.resolveLocalFileSystemURL(entry, success, fail);
				function fail(e) {
				  console.error('Error: ', e);
				}
		 
				function success(fileEntry) {
				  var namePath = fileEntry.nativeURL.substr(0, fileEntry.nativeURL.lastIndexOf('/') + 1);
				  // Only copy because of access rights
				  $cordovaFile.copyFile(namePath, fileEntry.name, cordova.file.dataDirectory, newFileName).then(function(success){
				  $rootScope.imageURI = newFileName;
				  console.log("$rootScope.imageURI "+$rootScope.imageURI);
				  }, function(error){
					$scope.showAlert('Error', error.exception);
				  });
				};
			  }
			);
			} else {
			  var result = result.substr(0, result.lastIndexOf('/') + 1);
			  // Move the file to permanent storage
			  $cordovaFile.moveFile(result, currentName, cordova.file.dataDirectory, newFileName).then(function(success){
				$rootScope.imageURI = newFileName;
				console.log("$rootScope.imageURI "+$rootScope.imageURI);
			  }, function(error){
				$scope.showAlert('Error', error.exception);
			  });
			}
			
			

        }, function(err) {
            console.log(err);
            $ionicLoading.hide();
        });
      }
	  
	  
	  
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
					$http.get(URL_PREFIX + "/api/security/pushtoken/save.do?tokenKey=" +  $rootScope.tokenId + "&userId=" + data.id)
						.then(function (res) {
							console.log('Update Device Token for ' + data.id + ' success');
						}, function (err) {
							console.error('ERR', JSON.stringify(err));
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

.controller('RegisterCtrl', function($scope, $stateParams,$state,$ionicSideMenuDelegate,$filter, $timeout,$http,$ionicPopup, ionicMaterialMotion,$ionicLoading, ionicMaterialInk) {
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
		$scope.formData.profile.birthday = $filter('date')(new Date($scope.formData.profile.birthday), "yyyy-MM-dd");
		console.log(JSON.stringify($scope.formData));
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

.controller('HomeCtrl', function($scope,$state, $rootScope, $window,$ionicActionSheet,$ionicSlideBoxDelegate, $ionicHistory,$ionicNavBarDelegate,$ionicSideMenuDelegate, $stateParams,$ionicPopup, $http,$filter, $timeout, ionicMaterialMotion,$ionicLoading, ionicMaterialInk,$cordovaCamera,$cordovaFileTransfer,$cordovaDevice,$cordovaFile) {
	
	console.log("HomeCtrl called");
	
	// Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
	$ionicNavBarDelegate.showBackButton(false);
	//$ionicSideMenuDelegate.canDragContent(true);
	
	$scope.userObj = JSON.parse(window.localStorage.getItem('user'));
	
	var today = new Date();
    if($stateParams.cdate != null && $stateParams.cdate != "" )
      today = new Date($stateParams.cdate);
   
    
	$scope.loadData = function(date){
		$ionicLoading.show();
		today = date;
		$scope.tomorrowDate = new Date(today.getTime()+1000*60*60*24);
		$scope.yesterdayDate = new Date(today.getTime()-1000*60*60*24);
		$scope.todayTxt = $filter('date')(today, "yyyy-MM-dd");
		$scope.yesterday = $filter('date')($scope.yesterdayDate, "yyyy-MM-dd");
		$scope.tomorrow = $filter('date')($scope.tomorrowDate, "yyyy-MM-dd");
		$scope.todate = $filter('date')(today, "yyyy-MM-dd");
		$http.get(URL_PREFIX+"/api/profile/consumption/date/list.do?id="+$scope.userObj.profile.id+"&date="+$filter('date')(date, "yyyy-MM-dd"))
			.then(function(res){
			  $ionicLoading.hide();
			  $scope.cList = res.data;
			  $scope.totalCalories = 0;
			  $scope.breakfastCalories = 0;
			  $scope.lunchCalories = 0;
			  $scope.dinnerCalories = 0;
			  $scope.snackCalories = 0;
			  for(var i=0; i<res.data.length; i++){
				$scope.totalCalories+=res.data[i].calories;
				if(res.data[i].mealType == 'breakfast')
					$scope.breakfastCalories += res.data[i].calories;
				else if(res.data[i].mealType == 'lunch')
					$scope.lunchCalories += res.data[i].calories;
				else if(res.data[i].mealType == 'dinner')
					$scope.dinnerCalories += res.data[i].calories;
				else if(res.data[i].mealType == 'snack')
					$scope.snackCalories += res.data[i].calories;
			  }

			}, function(err) {
					console.error('ERR', JSON.stringify(err));
					$ionicLoading.hide();
			});
	}
	$scope.loadData(today);
  //  summary weekly on graph
  /**
    $scope.series = ['Burn','Intake'];
    $scope.labels = [];
    $scope.data = [];
    $ionicLoading.show();
    $http.get(URL_PREFIX+"/getConsumptionWeeklyWS.do?patientKey="+userObj.keyString)
      .then(function(res){
          var intakelist = [];
          for(var i=4; i>=0; i--){
            var cdate = new Date(res.data[i].consumptionTime);
            $scope.labels.push($filter('date')(cdate, "dd/MM"));
            intakelist.push(res.data[i].calories);
          }
          $scope.data.push(intakelist);
          $ionicLoading.hide();
    }, function(err) {
  				console.error('ERR', JSON.stringify(err));
  				$ionicLoading.hide();
  	});
	**/
})

.controller('listConsumptionCtrl', function($scope,$rootScope,$cordovaSocialSharing,$cordovaFileTransfer, $cordovaFile,$cordovaDevice, $cordovaCamera, $ionicNavBarDelegate,$ionicSideMenuDelegate, $stateParams,$ionicLoading, $http) {
  console.log("listConsumptionCtrl called "+$stateParams.mealtype+" "+$stateParams.cdate);
  $ionicNavBarDelegate.showBackButton(true);
  if($stateParams.mealtype == undefined || $stateParams.mealtype == '')
    $stateParams.mealtype =   $rootScope.mealtype;
  else
    $rootScope.mealtype = $stateParams.mealtype;

  if($stateParams.cdate == undefined || $stateParams.cdate == '')
    $stateParams.cdate =   $rootScope.cdate;
  else
    $rootScope.cdate = $stateParams.cdate;

  $scope.mealtype = $stateParams.mealtype;
  $scope.$parent.showHeader();
  $scope.$parent.clearFabs();
  $scope.isExpanded = true;
  $scope.$parent.setExpanded(true);
  $scope.$parent.setHeaderFab(true);

  var userObj = JSON.parse(window.localStorage.getItem('user'));
  $scope.load = function() {
	console.log("load is called..");
    $ionicLoading.show();
    $http.get(URL_PREFIX+"/api/profile/consumption/meal/list.do?id="+userObj.profile.id+"&mealtype="+$stateParams.mealtype+"&date="+$stateParams.cdate)
      .then(function(res){
          $ionicLoading.hide();
          $scope.cList = res.data;
			
		  console.log("consumptions: "+$scope.cList.length );

      }, function(err) {
          console.error('ERR', JSON.stringify(err));
          $ionicLoading.hide();
      });
    }
    $ionicLoading.show();
   $scope.delItem = function(item){
	     $ionicLoading.show();
		 console.log("deleting "+item.id);
		 $http.get(URL_PREFIX+"/api/consumption/delete.do?id="+item.id)
		   .then(function(res){

			   $ionicLoading.hide();
			   $scope.load();
		   }, function(err) {
			   console.error('ERR', JSON.stringify(err));
			   $ionicLoading.hide();
		   });

   }
   
   $scope.shareItem = function(item){
	   var loadImgToBase64URL = function(url, callback, outputFormat){
			var img = new Image();
			img.crossOrigin = 'Anonymous';
			img.onload = function(){
				$ionicLoading.show();
				var canvas = document.createElement('CANVAS'),
				ctx = canvas.getContext('2d'), dataURL;
				canvas.height = this.height;
				canvas.width = this.width;
				ctx.drawImage(this, 0, 0);
				dataURL = canvas.toDataURL(outputFormat);
				callback(dataURL);
				canvas = null;
				
			};
			$ionicLoading.hide();
			img.src = url;
		}
		
		var shareImage = function(data){
			var options = {
			//  message: 'share this', // not supported on some apps (Facebook, Instagram)
			//  subject: 'the subject', // fi. for email
			  files: [data], // an array of filenames either locally or remotely
			//  url: 'https://www.smarthealthcare.in.th',
			  chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
			}

			var onSuccess = function(result) {
			  $ionicLoading.hide();
			  console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
			  console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
			}

			var onError = function(msg) {
				$ionicLoading.hide();
			  console.log("Sharing failed with message: " + msg);
			}
			window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
		}
		loadImgToBase64URL(URL_PREFIX+'/public/consumption/photo/download.do?share=true&id='+item.id, shareImage);
   }
   
   $scope.pathForImage = function(image) {
	  if (image === null) {
		return '';
	  } else {
		return cordova.file.dataDirectory + image;
	  }
   };
   
   $scope.uploadImage = function(id){
		$ionicLoading.show();
		   // Destination URL
		  var url = URL_PREFIX+"/api/consumption/photo/upload.do?id="+id;
		 
		  // File for Upload
		  var targetPath = $scope.pathForImage($scope.image);
		 
		  // File name only
		  var filename = $scope.image;
		  var params = new Object();
		  params.headers = {"___authorizationKey": userObj.authorizationKey, "Content-Type": "application/octet-stream"};
		  var options = {
			chunkedMode: false,
			mimeType: "image/jpg",
			params : params
		  };
		  
		 
		  $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
			console.log("upload successfully...");
			$ionicLoading.hide();
			$scope.load();
			
		  });
	}

	// take photo for profile
	$scope.chooseImage = function(item) {
	  console.log("chooseImage called "+item);
		var options = {
			quality: 80,
			destinationType: Camera.DestinationType.FILE_URI,
			//sourceType: Camera.PictureSourceType.CAMERA,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
			allowEdit: false,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 800,
			targetHeight: 600,
			popoverOptions: CameraPopoverOptions,
			saveToPhotoAlbum: false
		};

		$cordovaCamera.getPicture(options).then(function(imagePath) {
			console.log("getPicture called "+imagePath);
			 var currentName = imagePath.replace(/^.*[\\\/]/, '');

			//Create a new name for the photo
			var d = new Date(),
			n = d.getTime(),
			newFileName =  n + ".jpg";
		 
			// If you are trying to load image from the gallery on Android we need special treatment!
			if ($cordovaDevice.getPlatform() == 'Android' ) {
				window.FilePath.resolveNativePath(imagePath, function(entry) {
				window.resolveLocalFileSystemURL(entry, success, fail);
				function fail(e) {
				  console.log('Error: ', e);
				}
		 
				function success(fileEntry) {
				  var namePath = fileEntry.nativeURL.substr(0, fileEntry.nativeURL.lastIndexOf('/') + 1);
				  // Only copy because of access rights
				  $cordovaFile.copyFile(namePath, fileEntry.name, cordova.file.dataDirectory, newFileName).then(function(success){
				  $scope.image = newFileName;
				  $scope.uploadImage(item.id);
				  }, function(error){
					console.log('Error', error.exception);
				  });
				};
			  }
			);
			} else {
			  var namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
			  // Move the file to permanent storage
			  $cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function(success){
				$scope.image = newFileName;
				$scope.uploadImage(item.id);
			  }, function(error){
				console.log('Error', error.exception);
			  });
			}
		 
		  
		}, function(err) {
			console.log(err);
			$ionicLoading.hide();
		});
	  }

    $scope.load();


})

.controller('RecordConsumptionCtrl', function($scope,$state,$rootScope,$cordovaFileTransfer, $cordovaFile, $cordovaCamera, $timeout,$ionicHistory,$filter,$ionicNavBarDelegate, $stateParams,$http,$ionicLoading) {
  console.log("RecordConsumptionCtrl called x"+$rootScope.mealtype+" "+$rootScope.cdate);
  $scope.$parent.showHeader();
  $scope.$parent.clearFabs();
  $scope.isExpanded = false;
  $scope.$parent.setExpanded(false);
  $scope.$parent.setHeaderFab(false);
  $ionicNavBarDelegate.showBackButton(true);

  var userObj = JSON.parse(window.localStorage.getItem('user'));
  var headers = { 'Content-Type':'application/json' };
  $scope.searchFood = function(keyword){
    console.log("searching "+keyword);
    $ionicLoading.show();
    $http.get(URL_PREFIX+"/api/food/name/query.do?keyword="+keyword)
      .then(function(res){
          $ionicLoading.hide();
          $scope.resultList = res.data;
          $scope.keyword = keyword;
          $scope.selectFood = 'true';
          $scope.recordFood = 'false';
      }, function(err) {
          console.error('ERR', JSON.stringify(err));
          $ionicLoading.hide();
      });
  }

  $scope.newRecord = function(selectedItem){
      $scope.selectFood = 'false';
      $scope.recordFood = 'true';
      $scope.selectedItem = selectedItem;
      $scope.selectedFood  = {}
      $scope.selectedFood.name = selectedItem.name;
      $scope.selectedFood.code = selectedItem.code;
      $scope.selectedFood.profileId = userObj.profile.id;
      $scope.selectedFood.unitCount = 1;
      $scope.selectedFood.calories = selectedItem.calories * $scope.selectedFood.unitCount;
      $scope.selectedFood.logDate = $rootScope.cdate;
      $scope.selectedFood.mealType = $rootScope.mealtype;

  }

  $scope.toggleResult = function(){
    console.log("toggleResult called");
    $scope.selectFood = 'true';
    $scope.recordFood = 'false';
  }

  $scope.recal = function(){
    $scope.selectedFood.calories =   $scope.selectedItem.calories * $scope.selectedFood.unitCount;
  }
  
  $scope.pathForImage = function(image) {
	  if (image === null) {
		return '';
	  } else {
		return cordova.file.dataDirectory + image;
	  }
   };

  $scope.submit = function(){


    $ionicLoading.show();
    console.log( " record: "+JSON.stringify($scope.selectedFood));
    $http.post(URL_PREFIX+"/api/consumption/save.do",JSON.stringify($scope.selectedFood),headers).
			success(function(data, status, headers, config)
			{
				console.log(JSON.stringify(data));
				$ionicLoading.hide();
				if($rootScope.imageURI != undefined && $rootScope.imageURI != null && $rootScope.imageURI != ''){
					// upload image
				  // Destination URL
				  $ionicLoading.show();
				  var url = URL_PREFIX+"/api/consumption/photo/upload.do?id="+data.key;
				 
				  // File for Upload
				  var targetPath = $scope.pathForImage($rootScope.imageURI);
				 
				  // File name only
				  var params = new Object();
				  params.headers = {"___authorizationKey": userObj.authorizationKey, "Content-Type": "application/octet-stream"};
				  var options = {
					chunkedMode: false,
					mimeType: "image/jpg",
					params : params
				  };
				  
				 
				  $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
					console.log("upload successfully...");
					$ionicLoading.hide();
					$ionicHistory.goBack();
				  });
				} else{
					$ionicHistory.goBack();
				}
				//	$state.go("app.listConsumption");
				//$ionicHistory.goBack();
			}).
			error(function(data, status, headers, config)
			{
				console.log("error: "+data);
				$ionicLoading.hide();


			});
  }
// check if there image passing in from camera
  if($rootScope.imageData != undefined && $rootScope.imageData !=null){
	
    // classify with tensorflow
    $ionicLoading.show({template: "<span class='pretty-thai-text'>โปรดรอสักครู่<BR/>เรากำลังวิเคราะห์อาหารของคุณ...</span>"});
    $timeout(function () {
      $rootScope.tf.classify($rootScope.imageData).then(function(results) {
          console.log("Finish classification process");
          if(results.length>0){
          //  $rootScope.predictionResult = results;
            //$state.go("app.recordConsumption");
            var foundFoodKeys = [];
            results.forEach(function(result) {
                  console.log(result.title + " " + result.confidence);
                  foundFoodKeys.push(result.title);
            });
            console.log("find food by keys:"+JSON.stringify(foundFoodKeys));
            $http.post(URL_PREFIX+"/api/food/code/query.do",JSON.stringify(foundFoodKeys),headers).
        			success(function(data, status, headers, config)
        			{
                console.log("found foods "+JSON.stringify(data));
                $scope.resultList = data;
                $scope.keyword = "";
                $scope.selectFood = 'true';
                $scope.recordFood = 'false';
                $scope.hideSearch = 'false';
                $rootScope.cdate = $filter('date')(new Date(), "yyyy-MM-dd");
                $rootScope.mealtype = "breakfast";
                $ionicLoading.hide();
        			}).
        			error(function(data, status, headers, config)
        			{
        				console.log("error: xxxx"+data+" "+status);
        				$ionicLoading.hide();


        			});
          }
          $ionicLoading.hide();
          $rootScope.imageData = null;
      });
    }, 800);

  }
  
  

})

.controller('CategoryCtrl', function($scope,$state,$stateParams, $rootScope, $window,$ionicActionSheet,$ionicSlideBoxDelegate, $ionicHistory,$ionicNavBarDelegate,$ionicSideMenuDelegate,$ionicPopup, $http,$filter, $timeout, ionicMaterialMotion,$ionicLoading, ionicMaterialInk,$cordovaCamera,$cordovaFileTransfer,$cordovaDevice,$cordovaFile) {
	
	console.log("CategoryCtrl called "+$stateParams.categoryId);
	$scope.categoryId = $stateParams.categoryId;
	// Set Header
	$scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);
	$ionicNavBarDelegate.showBackButton(true);
	
	var userObj = JSON.parse(window.localStorage.getItem('user'));
	$scope.options = {legend: {display: true}};
	$scope.series = ['ค่่าวัดจริง'];
	$scope.datasetOverride = [{ fill: false }];
	$scope.colors = ['#777777','#81cdcd','#ec8a0d'];
	
	$scope.render = function(){
		$scope.isPreviewMode  = true;
		$scope.isListMode  = false;
		// query health category
		$ionicLoading.show();
		$http.get(URL_PREFIX+"/api/healthsummary/category/get.do?profileId="+userObj.profile.id+"&categoryId="+$stateParams.categoryId)
			.then(function(res){ 
				$ionicLoading.hide();
				console.log(JSON.stringify(res.data));
				$scope.summary = res.data;
				for(var i=0;i<$scope.summary.measures.length; i++){
					var highValues = [];
					var lowValues = [];
					for(var j=0;j<$scope.summary.measures[i].historyValues.length; j++){
						if($scope.summary.measures[i].measure.high1LabelTH!=null)
							highValues.push($scope.summary.measures[i].measure.high1Value);
						
						if($scope.summary.measures[i].measure.low1LabelTH!=null)
							lowValues.push($scope.summary.measures[i].measure.low1Value);
				
					}
					$scope.summary.measures[i].values = [];
					$scope.summary.measures[i].values.push($scope.summary.measures[i].historyValues);
					$scope.summary.measures[i].series = $scope.series;
					if(highValues.length != 0){
						$scope.summary.measures[i].values.push(highValues);
						$scope.summary.measures[i].series.push("ค่าสูง");
					}
					if(lowValues.length != 0){
						$scope.summary.measures[i].values.push(lowValues);
						$scope.summary.measures[i].series.push("ค่าต่ำ");
					}
					
					console.log(JSON.stringify($scope.summary.measures[i].values));
				}
				
			}
			, function(err) {
					console.error('ERR', JSON.stringify(err));
					$ionicLoading.hide();
			}); 	
	}
	
	
	$scope.render();
	
})

.controller('RecordListCtrl', function($scope,$state,$stateParams, $rootScope, $window,$ionicActionSheet,$ionicSlideBoxDelegate, $ionicHistory,$ionicNavBarDelegate,$ionicSideMenuDelegate,$ionicPopup, $http,$filter, $timeout, ionicMaterialMotion,$ionicLoading, ionicMaterialInk,$cordovaCamera,$cordovaFileTransfer,$cordovaDevice,$cordovaFile) {
	
	console.log("RecordListCtrl called "+$stateParams.categoryId);
	$scope.categoryId = $stateParams.categoryId;
	// Set Header
	$scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);
	$ionicNavBarDelegate.showBackButton(true);
	
	var userObj = JSON.parse(window.localStorage.getItem('user'));
	
	$scope.list = function(){
		$scope.isPreviewMode  = false;
		$scope.isListMode  = true;
		$ionicLoading.show();
		$http.get(URL_PREFIX+"/api/profile/healthlog/latest/list.do?profileId="+userObj.profile.id+"&categoryId="+$scope.categoryId+"&number=5")
			.then(function(res){ 
			$ionicLoading.hide();
			console.log(JSON.stringify(res.data));
			$scope.logList = res.data;
			for(var i=0; i<$scope.logList.length; i++){
				$scope.logList[i].logDate = new Date($scope.logList[i].logDate);
				$scope.logList[i].logDateNumber = $filter('date')($scope.logList[i].logDate, 'dd');
				$scope.logList[i].logMonth = $filter('date')($scope.logList[i].logDate, 'MMMM');
				$scope.logList[i].logDay = $filter('date')($scope.logList[i].logDate, 'EEEE');
				$scope.logList[i].logTime = $filter('date')($scope.logList[i].logDate, 'HH:mm');
			}
		}
		, function(err) {
				console.error('ERR', JSON.stringify(err));
				$ionicLoading.hide();
		});
	}
	
	$scope.list();
	
	
})

.controller('RecordFormCtrl', function($ionicNavBarDelegate,$scope, $stateParams, $timeout, $state,methodFactory, $http,$filter,$ionicPopup, ionicMaterialMotion,$ionicLoading, ionicMaterialInk) {
	console.log("RecordFormCtrl called "+$stateParams.categoryId);
   // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
	$ionicNavBarDelegate.showBackButton(true);
	$ionicLoading.show();
    var userObj = JSON.parse(window.localStorage.getItem('user'));
	$http.get(URL_PREFIX+"/api/profile/healthlog/latest/get.do?profileId="+userObj.profile.id+"&categoryId="+$stateParams.categoryId)
			.then(function(res){ 
			$scope.log = res.data;
			$http.get(URL_PREFIX+"/api/healthcategory/healthmeasure/list.do?id="+$stateParams.categoryId)
			.then(function(res){ 
				
				//console.log(JSON.stringify(res.data));
				$scope.measureList = res.data;
				for(var i=0; i<$scope.measureList.length; i++){
					//console.log($scope.measureList[i].code+" : "+$scope.log.props[$scope.measureList[i].code]);
					if($scope.log.props[$scope.measureList[i].code] != undefined)
						$scope.measureList[i].value = $scope.log.props[$scope.measureList[i].code];
					else
						$scope.measureList[i].value = 0;
					// set max value
					if($scope.measureList[i].high3Value != 9999)
						$scope.measureList[i].maxValue = $scope.measureList[i].high3Value * 2;
					else if($scope.measureList[i].high2Value != 9999)
						$scope.measureList[i].maxValue = $scope.measureList[i].high2Value * 2;
					else if($scope.measureList[i].high1Value != 9999)
						$scope.measureList[i].maxValue = $scope.measureList[i].high1Value * 2;
					else
						$scope.measureList[i].maxValue = 300;
					
					// set min value
					if($scope.measureList[i].low3Value != -9999)
						$scope.measureList[i].minValue = $scope.measureList[i].low3Value - $scope.measureList[i].low3Value;
					else if($scope.measureList[i].low2Value != -9999)
						$scope.measureList[i].minValue = $scope.measureList[i].low2Value - $scope.measureList[i].low2Value;
					else if($scope.measureList[i].low1Value != -9999)
						$scope.measureList[i].minValue = $scope.measureList[i].low1Value - $scope.measureList[i].low1Value;
					else
						$scope.measureList[i].minValue = 0;
					
					
					
				}
				console.log($scope.measureList);
				$ionicLoading.hide();
			}
			, function(err) {
					console.error('ERR', JSON.stringify(err));
					$ionicLoading.hide();
			}); 
			
	}
	, function(err) {
			console.error('ERR', JSON.stringify(err));
			$ionicLoading.hide();
	});
	
	$scope.submit = function(){
		var formData = {profileId: userObj.profile.id, categoryId: $stateParams.categoryId, props: {}};
		for(var i=0; i<$scope.measureList.length; i++){
			if(!$scope.measureList[i].calculation)
				formData.props[$scope.measureList[i].code] = $scope.measureList[i].value;
		}
		
		console.log(formData);
		// submit to service
		$ionicLoading.show();
		var headers = { 'Content-Type':'application/json' };
		$http.post(URL_PREFIX+"/api/healthlog/record.do",JSON.stringify(formData),headers).
			success(function(data, status, headers, config) 
			{
				$ionicLoading.hide();
				var alertPopup = $ionicPopup.alert({
					 title: 'Record Saved',
					 template: 'การบันทึกค่าเสร็จสมบูรณ์'
					});
				alertPopup.then(function(res) {
					$ionicNavBarDelegate.back();
				});
				
			}).
			error(function(data, status, headers, config) 
			{
				console.log("error: "+data);
				$ionicLoading.hide();
				
				
			});
	}

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

.directive('input', function () {
    return {
        restrict: 'E',
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (attrs.type.toLowerCase() === 'range') {
                // change output of range to number.
                ctrl.$parsers.push(function (value) {
                    var valueAsInt = parseInt(value);
                    var returnValue;
                    if (isFinite(valueAsInt)) {
                        returnValue = valueAsInt;
                    } else {
                        // don't change model
                        returnValue = ctrl.$modelValue;
                    }
                    return returnValue;
                });
            }
        }
    };
});
;
