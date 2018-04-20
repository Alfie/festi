      // This example adds a search box to a map, using the Google Place Autocomplete
      // feature. People can enter geographical searches. The search box will return a
      // pick list containing a mix of places and predicted search terms.

 function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -33.8688, lng: 151.2195},
      zoom: 13,
      mapTypeId: 'roadmap'
    });
	
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyD8MNJUAHQZ7k2b4eUWFE4pOnYC49g0p_8",
    authDomain: "festi-ae1b5.firebaseapp.com",
    databaseURL: "https://festi-ae1b5.firebaseio.com",
    projectId: "festi-ae1b5",
    storageBucket: "festi-ae1b5.appspot.com",
    messagingSenderId: "824144688265"
  };
  firebase.initializeApp(config);

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	
	var uploadLocLat = map.getCenter().lat();
	var uploadLocLng = map.getCenter().lng();
	
	var upload = document.getElementById('upload');
	upload.onclick = function(){uploadData(uploadLocLat,uploadLocLng)};
	
    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

	loadMarkers(map);
	
    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));
		
		uploadLocLat = place.geometry.location.lat();
		uploadLocLng = place.geometry.location.lng();
		
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
 }
 
 function loadMarkers(gmap) {
  var dbRef = firebase.database().ref('posts');
  dbRef.orderByValue().on("value", function(data) {
	  data.forEach(function(data) {
		  var postID = data.key;
		  //initialize lanLng
		  var latLng;
		  dataRef = firebase.database().ref('posts/'+postID);
		  
		  var geoFire = new GeoFire(dataRef);
		  geoFire.get("location").then(function(coords){
			  if (coords === null){
			  	console.log("no coordinates")
			  }
			  else{
				  //latLng does not keep value outside of if statement
				  latLng = {lat: coords[0],lng: coords[1]};
				  var marker = new google.maps.Marker({
				     position: latLng,
				     map: gmap
				  });
			  }
		  });
	  });
  });
 }
 
 function testMarkers(gmap){
	var dinates = {lat: 39.228915, lng: -76.929057}
 	var testMarker = new google.maps.Marker({
 		position: dinates,
 		map: gmap
 	});
 }
 
 function testPrint(latitude,longitude){
 	console.log(latitude+","+longitude)
 }
 
 function uploadData(latitude,longitude){
 	const newPostKey = firebase.database().ref('/posts').push().key;
	const update = {}
	var geoFire = new GeoFire(firebase.database().ref('posts/'+newPostKey));
	
	geoFire.set("location", [latitude,longitude]).then(function() {
		  console.log("Provided key has been added to GeoFire");
		}, function(error) {
		  console.log("Error: " + error);
	});
	
	update[newPostKey] = {
		timestamp: firebase.database.ServerValue.TIMESTAMP
	};
	firebase.database().ref().child('posts').update(update);
 }