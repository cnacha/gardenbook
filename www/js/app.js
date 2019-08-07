// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionic-material','ionic.cloud', 'ionMdInput','ngCordova','angularjs-gauge','chart.js','ion-datetime-picker'])

.run(function($ionicPlatform, $ionicLoading,$rootScope,$timeout) {
	
    $ionicPlatform.ready(function() {

		 // TensorFlow
		 
       var tf = new TensorFlow('orchid-model', {
            'label': 'My Custom Model',
            'model_path': "https://storage.googleapis.com/orchid-model/orchid_model_v2.zip#rounded_graph.pb",
            'label_path': "https://storage.googleapis.com/orchid-model/orchid_model_v2.zip#output_labels.txt",
            'input_size': 299,
            'image_mean': 128,
            'image_std': 128,
            'input_name': 'Mul',
            'output_name': 'final_result'
        })
        tf.onprogress = function(evt) {
          
          if (evt['status'] == 'downloading'){
			  $ionicLoading.show({template: "Downloading prediction model...<BR/>"+evt.label});
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
        url: '/home',
        views: {
            'menuContent': {
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
            }
        }
    })
	
	

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
});
