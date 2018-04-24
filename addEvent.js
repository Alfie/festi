function initModal() {
	// Get the modal
	var modal = document.getElementById('mapModal');
	
	// Get the button that opens the modal
	//var btn = document.getElementById("upload");

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];

	// When the user clicks the button, open the modal 
	//btn.onclick = function() {
	    modal.style.display = "block";
		//}
		
		

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	    modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	    if (event.target == modal) {
	        modal.style.display = "none";
	    }
	}
	
	modalMap();
	
}

function modalMap() {
	var map;
	
    map = new google.maps.Map(document.getElementById('modalMap'), {
        center: {lat: -33.8688, lng: 151.2195},
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	
	var confirmLocLat = map.getCenter().lat();
	var confirmLocLng = map.getCenter().lng();
	
	var mapConfirm = document.getElementById('mapConfirm');
	mapConfirm.onclick = function(){confirmMap(confirmLocLat,confirmLocLng)};
	
    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
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
			
			confirmLocLat = place.geometry.location.lat();
			confirmLocLng = place.geometry.location.lng();
			coordinates = [confirmLocLat,confirmLocLng];

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
	
    $(function() {
        $('#myModal').on('shown', function () {
            google.maps.event.trigger(map, "resize");
        });
    });
}

function confirmMap(latitude,longitude){
	var modal = document.getElementById('mapModal');
	modal.style.display = "none";
	console.log(latitude+","+longitude);
	initCalModal();
}