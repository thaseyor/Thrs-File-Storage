<?php
date_default_timezone_set ('Asia/Almaty');
$dir    = './files';
$files = scandir($dir);
unset($files[0]);
unset($files[1]);
$var = 0;
echo "<ul class='files'>";
foreach ($files as $key => $value) {
	$var+=1;
	echo "<li class='content'>";
	echo "<div class='down'>";
	echo "<div class='tex'>";
    echo "<a href='files/$value' download>$var. $value</a>";
    echo "</div>";
    echo "<a href='files/$value' class='downloadBox' download><img class='downloadPic'  title='Download' src='./img/upload.svg'></a>";
     if ($_COOKIE['permission']=='228') {
            echo "<img title='Delete' src='https://i.ibb.co/KF4N1x5/rcj-Kp4-Kni.png' class='bin' onclick=", '"foo(' , "'$value'",')" ></br>';
     }
    echo "</div>";
    $size = filesize("files/".$value);
    echo "<p>","Вес: ", ceil($size/8/1024) ,' г', "</p>";
    echo " " . date ('m.d.Y H:i',filemtime("./files/$value")), "</br></br>";
    echo "</li>"; 
}
echo "</ul>";
?>