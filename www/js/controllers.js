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
   
	var orchidEN = ['intanon villosum','concolor','charlesworthii','sukhakulii','exul','godefroyae','henryanum','spicerianum','callosum','gratrixianum','bellatulum','hirsutissimum','niveum','parishii','purpuratum'];
	var orchidTH = ['อินทนนท์','เหลืองปราจีน','ดอยตุง','สุขสกุล','เหลืองกระบี่','เหลืองตรัง','เฮนรี่ยานนั่ม','สไปเซเรียนุม','คางกบ','อินทนนท์ลาว','รองเท้านารีฝาหอย','เหลืองเลย','ขาวสตูล','เมืองกาญจน์','Purpuratum'];
	var descTH = [
	'มีลักษณะลำต้นสั้นและแตกกอ ใบ รูปเข็มขัด ไม่มีลาย กว้าง 3.5-4 ซม. ยาว 20-25 ซม. โคนใบมีประสีแดง แกมม่วง ดอก ออกเดี่ยวตามซอกใบ ก้านดอกยาว 20-30 ซม. กลีบเลี้ยงกลีบบนแผ่โค้ง ตอนกลางมีแต้มเป็นปื้นสีน้ำตาล ขอบกลีบสีขาว กลีบดอกรูปช้อนบิดและแผ่โค้ง แถบบน สีน้ำตาลอมแดง แถบล่างสีเหลือง กลีบกระเป๋าสีเหลืองอ่อน แกมน้ำตาล ดอกบานเต็มที่กว้าง 10-12 ซม. ',
	'มีลักษณะเป็นพุ่มต้นกว้างประมาณ 20-25 ซม. สูงประมาณ 10-20 ซม. ใบกว้าง 2.5-3.5 ซม. ยาว 10-20 ซม. ใบด้านบนเป็นลายสีเขียวสลับเขียวอ่อน ใต้ท้องใบมีจุดประสีม่วงเล็กน้อย ดอกกว้างประมาณ 3.5-7 ซม. ก้านช่อดอกค่อนข้างสั้นประมาณ 5-7 ซม. ช่อหนึ่งมี 1-2 ดอก กลีบบนและกลีบในสีเหลืองมีจุดประสีม่วงกระจายทั่วกลีบ',
	'มีลักษณะพุ่มต้นกว้างประมาณ 20-25 ซม. ใบกว้าง 2.5-3 ซม. ยาว 20-25 ซม. ใบด้านบนสีเขียวเป็นมัน ใต้ใบบริเวณโคนกาบใบมีจุดประสีม่วง แตกหน่อง่าย มักเจริญเติบโตเป็นกอ ดอกเป็นดอกเดี่ยว ขนาดดอก กว้างประมาณ 7-9 ซม. ช่อตั้งตรงยาว 10-12 ซม. กลีบบนพื้นสีขาว มีเส้นลายสีชมพูเข้มหนาแน่น ไล่จากโคนกลีบขึ้นไปด้านบน กลีบในแคบงุ้มมาด้านหน้ามีสีเหลืองอมน้ำตาล กระเป๋าสีเหลืองอมน้ำตาลเป็นมัน โล่สีขาว กึ่งกลางมีติ่งสีเหลือง',
	'มีลักษณะลำต้นสั้นและแตกกอ ใบ รูปขอบขนานแกมรี กว้าง 3-5 ซม. ยาว 10-15 ซม. แผ่นใบด้านบนสีเขียวอ่อนมีประสีเขียวแก่ ดอก เดี่ยว ขนาดบานเต็มที่กว้าง 5-8 ซม. ก้านดอกสีม่วงมีขน ยาว 20-30 ซม. กลีบบนสีเขียวอ่อน มีเส้นสีเขียวขนานตามยาวถึงปลาย กลีบแหลม กลีบดอกสีเขียวและมีประสีม่วงเข้มจำนวนมาก รูปขอบขนานแกมรูปหอก ยาวกว่าทุกกลีบ ปลายกลีบแหลม กลีบกระเป๋าเป็นถุงลึกสีน้ำตาลแดง',
	'มีลักษณะเป็นไม้พุ่มกว้างประมาณ 30-40 ซม. ใบกว้าง 2.5-3 ซม. ยาว 20-30 ซม. ใบสีเขียวเป็นมัน แตกหน่อง่าย มักเจริญเติบโตเป็นกอใหญ่ ดอกเป็นดอกเดี่ยวขนาดดอก 6-7 ซม. ก้านดอกยาวประมาณ 12-15 ซม. กลีบบนมีริมสีขาว โคนกลีบสีเขียวปนเหลือง และมีจุดประขนาดใหญ่สีม่วงปนน้ำตาล กลีบในแคบสีเหลืองเป็นมัน ริมกลีบเป็นคลื่นงุ้มมาด้านหน้า มีเส้นสีน้ำตาลกลางกลีบ กระเป๋าสีเหลืองอมเขียวเป็นมันเงา',
	'มีลักษณะต้นเป็นพุ่มกว้างประมาณ 15-20 ซม. ใบกว้าง 2.5-3.5 ซม. ยาว 15-17 ซม. ใบด้านบนเป็นลายสีเขียวเข้มสลับเขียวเทา บางต้นสีเขียวเข้มจะมากกว่าจนดูคล้ายใบสีเขียวเข้ม ใต้ท้องใบสีม่วงคล้ำ ดอกค่อนข้างกลม กว้างประมาณ 5-8 ซม. ใหญ่กว่ารองเท้านารีขาวสตูลเล็กน้อย สีพื้นดอกมีทั้ง สีขาว สีครีม สีเหลืองอ่อนถึงเหลืองเข้ม มีลายสีม่วงแดงถึงม่วงน้ำตาลกระจายหนาแน่นทั่วกลีบดอก ก้านช่อดอกค่อนข้างสั้นประมาณ 5-10 ซม. ช่อหนึ่งมี 1-2 ดอก',
	'มีลักษณะใบยาว 10 - 17 เซนติเมตร กว้าง 1 – 2 เซนติเมตร แผ่นใบมีสีเขียวเข้มมันวาวขอบใบสีเหลือง ใต้ท้องใบมีสีม่วงตรงบริเวณโคนใบ เห็นร่องเส้นกลางใบชัดเจน ลักษณะเป็นดอกเดี่ยว ช่อดอกยาว 4 -17 เซนติเมตร มีขนสีดำปกคลุม เมื่อดอกบานเต็มที่มีขนาดความกว้าง 9 - 12 เซนติเมตร ',
	'มีลักษณะใบรูปรีแกมรูปขอบขนาน ปลายใบมนถึงแหลม ดอกเดี่ยว หรือ 2 ดอกต่อช่อ ก้านดอก ยาว 20-40 ซม. กลีบเลี้ยงบน รูปไข่ สีขาว มีลายเส้นสีม่วง 1 เส้น กลางกลีบ โคนสีเขียวอ่อน ปลายกลีบแหลม กลีบดอก สีเขียวอ่อน โคนกลีบและกลางกลีบลายเส้นและขน สีม่วง ขอบกลีบบิดเป็นคลื่น กระเป๋าสีเขียวแกมม่วงแดง โล่สีชมพูแกมม่วง ขอบสีขาว ตรงกลางสีเหลือง ดอกขนาด 6-8 ซม.',
	'มีลักษณะลำต้นสั้นและแตกกอ ใบ รูปขอบขนาน กว้าง 3-3.5 ซม. ยาว 15-18 ซม. ผิวใบด้านบนลาย หลังใบ สีเขียวอ่อน ดอก ออกเดี่ยวที่ปลายยอด ก้านดอกตั้งตรง สีม่วงเข้ม ยาว 25-30 ซม. มีขน กลีบเลี้ยงกลีบบนแผ่กว้าง สีขาว และมีขีดสีเขียวแกมม่วงแดงตามยาว กลีบดอกรูปขอบขนานโค้ง ขอบกลีบมีตุ่มสีน้ำตาลเข้มเป็นมันและมีขน กลีบกระเป๋า สีม่วงแดงแกมน้ำตาล ดอกบานเต็มที่กว้าง 6-8 ซม. ',
	'มีลักษณะลำต้นสั้นและแตกกอ ใบ รูปเข็มขัด กว้าง 2-2.5 ซม. ยาว 25-28 ซม. ดอก ออกดอกเดี่ยว ก้านดอก สีม่วงแดง ยาว 20-22 ซม. กลีบเลี้ยงกลีบบนแผ่กว้างสีขาว ขอบกลีบตอนบนหยักเว้ามีเดือย กลางกลีบมีประสีม่วงแดง โคนกลีบสีน้ำตาลอมแดง กลีบดอกรูปขอบขนานบิดโค้ง แถบบนสีน้ำตาลอ่อน แถบล่างสีเหลือง กลีบกระเป๋า สีเหลืองอมน้ำตาล ดอกบานเต็มที่กว้าง 7-8 ซม. ',
	'มีลักษณะเป็นพุ่มต้นกว้างประมาณ 20-25 ซม. สูงประมาณ 10 ซม. ใบกว้าง 2.5-3.5 ซม. ยาว 15-17 ซม. ใบด้านบนเป็นลายสีเขียวสลับเขียวอ่อน ใต้ท้องใบมีจุดสีม่วงเข้มกระจายหนาแน่นทั่งใบ มักเจริญเติบโตเป็นกอใหญ่ ออกดอกเดี่ยว ค่อนข้างกลม กว้างประมาณ 3.5-7 ซม. กลีบบนและกลีบในสีขาวเป็นมัน ค่อนข้างหนา กลีบมีจุดสีม่วง-น้ำตาลขนาดใหญ่กระจายทั่วกลีบ ก้านช่อดอกอ่อน และสั้นขนาด 3-5 ซม.',
	'มีลักษณะลำต้นสั้นและแตกกอ ใบ รูปขอบขนาน กว้าง 2.5-3 ซม. ยาว 28-36 ซม. ดอก ออกเดี่ยว ก้านดอกยาว 17-25 ซม. กลีบเลี้ยงกลีบบนแผ่โค้งสีเหลืองเข้ม ขอบเป็นคลื่น มีประสีน้ำตาลที่โคนกลีบ กลีบดอกรูปขอบขนาน ขอบหยักเป็นคลื่น กลางกลีบมีประสีน้ำตาลแดง ดอกบาน เต็มที่กว้าง 8-9 ซม',
	'มีลักษณะลำต้นสั้นและแตกกอ ใบรูปขอบขนานกว้าง2.5-3 ซม. ยาว 8-10 ซม. ผิวใบด้านบนลาย กลังใบสีม่วงเข้ม จำนวน 3-4 ใบ ดอกออกเป็นช่อ 1-3 ดอก สีขาว กลีบเลี้ยงและกลีบดอกมีสีม่วงแกมแดงเป็นแนวยาวใกล้โคนกลีบ กลีบกระเป๋าผิวมัน ดอกบานเต็มที่กว้าง 4-5 ซม',
	'มีลักษณะลำต้นสั้นและแตกกอ ใบ รูปเข็มขัด ไม่มีลาย กว้าง 3.5-4 ซม. ยาว 30-40 ซม. ดอก ออกเป็นช่อ ตามซอกใบ ช่อดอกยาว 30-60 ซม. จำนวน 4-7 ดอกต่อช่อ สีเหลืองแกมเขียว กลีบเลี้ยงกลีบบนแผ่ตั้งปลายแหลม กลีบดอกเรียวยาวและบิดเป็นเกลียว ยาว 7-9 ซม. มีตุ่มสีม่วงคล้ำ ที่โคนกลีบ กลีบกระเป๋าสีเขียวแกมน้ำตาล ดอกบานเต็มที่ กว้าง 6 ซม.',
	'Paphiopedilum purpuratum is a native species of orchids found from southern China to Hainan Island. The species was discovered on Hong Kong Island in 1850.'
	];
	
	$scope.nameToThai = function(str){
		for(var i=0;i<orchidEN.length; i++){
			if(orchidEN[i] == str)
				return orchidTH[i];
		}
	}
	
	$scope.describeThai = function(str){
		for(var i=0;i<orchidEN.length; i++){
			if(orchidEN[i] == str)
				return descTH[i];
		}
	}
   // Form data for the login modal;
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
			console.log("onload is called");
			$rootScope.imageData = encoded;
			 // classify with tensorflow
			$ionicLoading.show({template: "<span class='pretty-thai-text'>โปรดรอสักครู่<BR/>เรากำลังวิเคราะห์ภาพของคุณ...</span>"});
			$timeout(function () {
			  $rootScope.tf.classify($rootScope.imageData).then(function(results) {
				  console.log("Finish classification process");
				  if(results.length>0){
					var foundFoodKeys = [];
					results.forEach(function(result) {
						  console.log(result.title + " " + result.confidence);
						  foundFoodKeys.push(result.title);
					});
					$rootScope.bestResult = foundFoodKeys[0];
					console.log("find food by keys:"+JSON.stringify(foundFoodKeys));
		  
				  }
				  $ionicLoading.hide();
				  $rootScope.imageData = null;
			  });
			}, 800);
			$state.go("app.home");
		};
		var fileReader = new FileReader();
		fileReader.onload = onload;
		//fileReader.onprogress = progress;
		resolveFile(file).then(function(actualFile) {
			 fileReader.readAsBinaryString(actualFile);
			
		});
	}
	
	 // take photo for image recognition
	$scope.takeImage = function(camera) {
      console.log("takeImage called "+camera);
	  var source = Camera.PictureSourceType.PHOTOLIBRARY;
	  if(camera)
		  source = Camera.PictureSourceType.CAMERA;
        var options = {
            quality: 80,
            //destinationType: Camera.DestinationType.DATA_URL,
		    destinationType: Camera.DestinationType.FILE_URI,
            sourceType: source,
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
				  $rootScope.imageURL = cordova.file.dataDirectory+$rootScope.imageURI;
				  console.log("$rootScope.imageURL "+cordova.file.dataDirectory+$rootScope.imageURI);
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
	  
	
	$scope.getTimeStamp = function(){
		return (new Date()).getTime();
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
	
	
	// check if there image passing in from camera
  if($rootScope.imageData != undefined && $rootScope.imageData !=null){
	
    // classify with tensorflow
    $ionicLoading.show({template: "<span class='pretty-thai-text'>โปรดรอสักครู่<BR/>เรากำลังวิเคราะห์ภาพของคุณ...</span>"});
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
  
          }
          $ionicLoading.hide();
          $rootScope.imageData = null;
      });
    }, 800);

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
