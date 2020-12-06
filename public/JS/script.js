var firebaseConfig = {
    apiKey: 'AIzaSyBQwFUkF1YJkjEUB7W6XgZ-sUkZqmtraNU',
    authDomain: 'thrs-652a9.firebaseapp.com',
    databaseURL: 'https://thrs-652a9.firebaseio.com',
    storageBucket: 'gs://thrs-652a9.appspot.com'
  };
  firebase.initializeApp(firebaseConfig);

  
  var progressBar=document.getElementById('progress');
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


// fileButton.addEventListener('change',function(e){

// var file = e.target.files[0];
// var storageRef = firebase.storage().ref('files/'+String(file.name));
// var task= storageRef.put(file);
// task.on('state_changed',

// function progress(snapshot){
// var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
// progressBar.innerHTML=percentage;
// },
// function error(err){
//   console.log(err)
// },
// function complete(){
//   progressBar.innerHTML='Complete!';
// }
// );
// });


var storageRef = firebase.storage().ref('');
var listRef = storageRef.child('files/');
// Find all the prefixes and items.
listRef.listAll().then(function(res) {
  res.prefixes.forEach(function(folderRef) {
    // All the prefixes under listRef.
    // You may call listAll() recursively on them.
  });
  res.items.forEach(function(itemRef) {

	var forestRef = storageRef.child(itemRef['_delegate']['_location']['path_']);
	
// Get metadata properties
forestRef.getMetadata().then(function(metadata) {
	console.log(metadata);
}).catch(function(error) {
  console.log(error)
});

   
    var li=document.createElement('li');
    li.classList.add("content");
    
    document.getElementById('list').appendChild(li);
    li.innerHTML=itemRef['_delegate']['_location']['path_'];
// <div class='down'>
// <div class='tex'>
//     <a href='files/$value'>$var. $value</a>
//     </div>
//     <a href='files/$value' class='downloadBox' download><img class='downloadPic'  title='Download' src='./img/upload.svg' /></a>
//     </div>
//     $size = filesize("files/".$value);
//     <p>","Вес: ", ceil($size/8/1024) ,' г', "</p>";
//      " . date ('m.d.Y H:i',filemtime("./files/$value")), "</br></br>";
//     </li>
  });
}).catch(function(error) {
  console.log(error);
  });
