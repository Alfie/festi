function initCalModal(){
	var calModal = document.getElementById('calendarModal');
	var span = document.getElementsByClassName("close")[0];
	calModal.style.display = "block";
	
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
}