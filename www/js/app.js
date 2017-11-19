// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionic-material','ionic.cloud', 'ionMdInput','ngCordova','angularjs-gauge','chart.js','ion-datetime-picker'])

.run(function($ionicPlatform, $ionicLoading,$rootScope,$timeout) {
	
    $ionicPlatform.ready(function() {
		// ChartJS
        Chart.defaults.global.defaultFontColor = 'rgba(0, 0, 0, 0.8)';
		Chart.defaults.global.defaultFontFamily = "'Prompt', sans-serif";
		Chart.defaults.global.elements.point.radius = 5;
		Chart.defaults.global.elements.point.hitRadius = 5
		Chart.defaults.global.elements.point.borderColor = '#FFF';
		Chart.defaults.global.elements.point.borderWidth = 2;
		Chart.defaults.global.elements.point.backgroundColor = '#78ffff';
		Chart.defaults.global.defaultFontSize = 12;
		Chart.defaults.global.legend.labels.boxWidth = 20;
		Chart.defaults.global.colors  =  ['#83b5c4','#306c81','#a3dcdf','#c5dce6','#78ffff','#2ba8cd','#2c6376','#95c8cb','#b4c8d2','#6ee8e8'];
		// Push Notification
		var push = PushNotification.init({
			android: {
				"senderID": "358620280542",
				"iconColor": "#343434",
				"forceShow" : false
			},
			ios: {
				"senderID": "358620280542",
				"alert": true,
				"badge": true,
				"sound": true
			},
			browser: {
				pushServiceURL: 'http://push.api.phonegap.com/v1/push'
			}
		});
		push.on('registration', function(data) {
		  console.log("registrationId "+data.registrationId);
		  $rootScope.tokenId = data.registrationId;
		});
		push.on('notification', function ( data) {
			if($rootScope.isNotificationCalled == undefined ||  !$rootScope.isNotificationCalled){
				$rootScope.isNotificationCalled = true;
				var alertPopup = $ionicPopup.alert({
					title: "ข้อความเตือน",
					template: data.message,
					 buttons: [
					  { text: 'OK',  onTap: function(e) {
							  console.log(e);
							  $rootScope.isNotificationCalled = false;
							  return true; 
							} 
					   }
					 ]
				});
			}
			
		});
		 // TensorFlow
        var tf = new TensorFlow('food-model', {
            'label': 'My Custom Model',
            'model_path': "https://storage.googleapis.com/ha-models/food_model_v4.zip#output_graph_round_v4.pb",
            'label_path': "https://storage.googleapis.com/ha-models/food_model_v4.zip#output_labels_v4.txt",
            'input_size': 299,
            'image_mean': 128,
            'image_std': 128,
            'input_name': 'Mul',
            'output_name': 'final_result'
        })
       var tf = new TensorFlow('food-model', {
            'label': 'My Custom Model',
            'model_path': "https://storage.googleapis.com/ha-models/food_model_v4.zip#output_graph_round_v4.pb",
            'label_path': "https://storage.googleapis.com/ha-models/food_model_v4.zip#output_labels_v4.txt",
            'input_size': 299,
            'image_mean': 128,
            'image_std': 128,
            'input_name': 'Mul',
            'output_name': 'final_result'
        })
        tf.onprogress = function(evt) {
          
          if (evt['status'] == 'downloading'){
			  $ionicLoading.show({template: "Please wait a moment<BR/>We are downloading food prediction model...<BR/>"+evt.label});
              console.log("Downloading model files...");
              console.log(evt.label);
              if (evt.detail) {
                  // evt.detail is from the FileTransfer API
                  var $elem = $('progress');
                  $elem.attr('max', evt.detail.total);
                  $elem.attr('value', evt.detail.loaded);
              }
          } else if (evt['status'] == 'unzipping') {
              console.log("Extracting contents...");
			  $ionicLoading.show({template: "Unzipping the prediction model"});
          } else if (evt['status'] == 'initializing') {
			  $ionicLoading.show({template: "Initializing the prediction model"});
              console.log("Initializing TensorFlow");
          }
        };
        tf.load().then(function() {
            $ionicLoading.hide();
            console.log("Model loaded");
            $rootScope.tf = tf;
        });
		
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider,$ionicCloudProvider) {
	/**
	$ionicCloudProvider.init({
        "core": {
            "app_id": "6246a58a"
        },
        "push": {
            "sender_id": "1091753368379",
            "pluginConfig": {
                "ios": {
                "badge": true,
                "sound": true
                },
                "android": {
                "iconColor": "#343434"
                }
            }
        }
    });
	**/
	
    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);

    /*
    // Turn off back button text
	*/
    $ionicConfigProvider.backButton.previousTitleText(false);
 

    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })
   
    .state('app.login', {
        url: '/login',
        views: {
            'menuContent': {
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            },
        }
    })
	
	.state('app.logout', {
		url: '/logout',
		views: {
            'menuContent': {
			templateUrl: 'templates/login.html',
			controller: 'LogoutCtrl'
			},
		}
	})
	
	.state('app.welcome', {
		url: '/welcome',
		views: {
            'menuContent': {
			templateUrl: 'templates/welcome.html',
			controller: 'WelcomeCtrl'
			},
		}
	})

    .state('app.home', {
        url: '/home/:cdate',
        views: {
            'menuContent': {
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
            },
             'fabContent': {
                template: '<button id="fab-camrecord" ng-click="takeImage()" class="button button-fab button-fab-top-right button-calm spin"><i class="icon ion-image"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-camrecord').classList.toggle('on');
                    }, 800);

                }

            }
        }
    })
	
	.state('app.listConsumption', {
         url: '/listConsumption/:mealtype/:cdate',
         views: {
             'menuContent': {
                 templateUrl: 'templates/listConsumption.html',
                 controller: 'listConsumptionCtrl'
             },
             'fabContent': {
               template: '<button id="fab-record" ng-click="newrecord()" class="button button-fab button-fab-bottom-right button-calm spin"><i class="icon ion-plus"></i></button>',
               controller: function ($timeout) {
                   $timeout(function () {
                       document.getElementById('fab-record').classList.toggle('on');
                   }, 800);

               }
             }
        }
     })
	 
	 .state('app.recordConsumption', {
        url: '/recordConsumption/:mealtype/:cdate',
        views: {
            'menuContent': {
                templateUrl: 'templates/recordConsumption.html',
                controller: 'RecordConsumptionCtrl'
            },
            'fabContent': {}
            }
    })

	
	.state('app.category', {
        url: '/category/:categoryId',
        views: {
            'menuContent': {
                templateUrl: 'templates/categoryBody.html',
                controller: 'CategoryCtrl'
            },
            'fabContent': {}
        }
    })
	
	.state('app.recordList', {
        url: '/category/:categoryId',
        views: {
            'menuContent': {
                templateUrl: 'templates/recordList.html',
                controller: 'RecordListCtrl'
            },
            'fabContent': {}
        }
    })
	
	.state('app.recordForm', {
        url: '/recordForm/:categoryId',
        views: {
            'menuContent': {
                templateUrl: 'templates/recordForm.html',
                controller: 'RecordFormCtrl'
            },
            'fabContent': {}
				
        }
    })
	
	 .state('app.register', {
        url: '/register',
        views: {
            'menuContent': {
                templateUrl: 'templates/register.html',
                controller: 'RegisterCtrl'
            },
            'fabContent': {}
            }
    })
	
	

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/login');
});
