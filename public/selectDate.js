
function initCalModal(lat, lng){
	var calModal = document.getElementById('calendarModal');
	var span = document.getElementsByClassName("close")[1];
	var today = new Date();
	var eventDate = today.getTime();
	calModal.style.display = "block";
	
	var submit = document.getElementById('submit');
	submit.onclick = function(){uploadData(lat, lng, document.getElementById("title").value, eventDate)};
	
	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	    calModal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	    if (event.target == calModal) {
	        calModal.style.display = "none";
	    }
	}
	
	new niceDatePicker({
	    dom:document.getElementById('calendar1-wrapper2'),
	    mode:'en',
	    onClickDate:function(date){
			var d = new Date(date);
			eventDate = d.getTime();
	    }
	})
	
}