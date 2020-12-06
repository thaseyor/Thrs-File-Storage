$('#file-input').change(function() {
	var fileResult = $(this).val();
    document.getElementById("fileName").innerHTML = fileResult;
});