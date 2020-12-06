<!DOCTYPE html>
	<html>
		<head>
			<script src="dropzone.min.js"></script>
			<link rel="stylesheet" type="text/css" href="css/dropzone.css">
			<link rel="shortcut icon" type="image/x-icon" href="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Screw_Head_-_Hex_External.svg/1024px-Screw_Head_-_Hex_External.svg.png">
			<link rel="stylesheet" href="css/style.css">
			<meta charset="utf-8" />
			<title>Uploading</title>
		</head>
		<body>
			<canvas></canvas>
			<canvas></canvas>
		    <header>
		        <div class="titleGa">
		            <a href="https://sehl.ga/" target="_blank">
		                 <img src="https://sehl.ga/theme/clean/img/favicon.png">wsp
		            </a>
		        </div>
		         <div class="titleTk">
		            <a href="https://thsr.tk/">
		                ths<img class="invert" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Screw_Head_-_Hex_External.svg/1024px-Screw_Head_-_Hex_External.svg.png">
		            </a>
		        </div>
			</header>
			<div id="upload-container">
				<div id="drop">
				<form action="index.php" class="dropzone"><h2 class="uploadTitle"><b>Uploading</b></h2></form>
				</div>
			</div>
		<?php include_once "php/dir.php"; ?>
		<?php
$ds          = DIRECTORY_SEPARATOR;  //1
 
$storeFolder = 'files';   //2
 
if (!empty($_FILES)) {
     
    $tempFile = $_FILES['file']['tmp_name'];          //3             
      
    $targetPath = dirname( __FILE__ ) . $ds. $storeFolder . $ds;  //4
     
    $targetFile =  $targetPath. $_FILES['file']['name'];  //5
 
    move_uploaded_file($tempFile,$targetFile); //6
}
?>     
		<script type="text/javascript" src="JS/hex.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
		<script type="text/javascript" src="JS/script.js"></script>
		</body>
	</html>