var firebaseConfig = {
    apiKey: 'AIzaSyBQwFUkF1YJkjEUB7W6XgZ-sUkZqmtraNU',
    authDomain: 'thrs-652a9.firebaseapp.com',
    databaseURL: 'https://thrs-652a9.firebaseio.com',
    storageBucket: 'gs://thrs-652a9.appspot.com'
  };
  firebase.initializeApp(firebaseConfig);

  var dropZone = $('#upload-container');
  
	dropZone.on('drop', function(e) {
		dropZone.removeClass('dragover');
		let files = e.originalEvent.dataTransfer.files;
		sendFiles(files);
  });
  
	setTimeout(function(){ 
		var fileButton=document.getElementById('file-input');
		fileButton.addEventListener('change',function(e){
		let files = e.target.files;
		sendFiles(files);
	}); }, 1000);
	
	function sendFiles(files) {
		$(files).each(function(index, file) {
			var storageRef = firebase.storage().ref('files/'+String(file.name));
			storageRef.put(file);
		})
	};

var storageRef = firebase.storage().ref('');
var listRef = storageRef.child('files/');
// Find all the prefixes and items.
listRef.listAll().then(function(res) {
  res.items.forEach(function(itemRef) {
    var MetadataRef = storageRef.child(itemRef['_delegate']['_location']['path_']);
    // Get metadata properties
    MetadataRef.getMetadata().then(function(metadata) {
      var li=document.createElement('li');
        li.classList.add("content");
        document.getElementById('list').appendChild(li);
        var a = document.createElement('a');
        a.setAttribute('download',metadata['name']);
        a.innerHTML=metadata['name'];
        li.appendChild(a);
        storageRef.child(itemRef['_delegate']['_location']['path_']).getDownloadURL().then(function(url) {
          a.href=url;
        }).catch(function(error) {console.log(error)});

        var p = document.createElement('p');
        p.innerHTML='Размер файла: '+Math.round(metadata['size']/1024) + ' Кб';
        li.appendChild(p);
        var p = document.createElement('p');
        p.innerHTML='Дата загрузки: '+metadata['timeCreated'].slice(0,10);;
        li.appendChild(p);
    }).catch(function(error) {console.log(error)});
  });
}).catch(function(error) {console.log(error);});