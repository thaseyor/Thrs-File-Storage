<?php
if($_GET['id']){
	$del = (string)$_GET['id'];
	unlink("../files/$del");
	header("Refresh:0; url=/");
}
?>