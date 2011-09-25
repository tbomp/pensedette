<?php
require_once("sources/requetes.php");
?>
<!doctype html>
<html>

	<head>
	
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1"> 
    <title>PenseDette - v0.6</title> 
	<link rel="stylesheet" media="all" href="css/pensedette.css"/>
    <link rel="stylesheet" href="http://code.jquery.com/mobile/1.0b3/jquery.mobile-1.0b3.min.css" />
    <script src="http://code.jquery.com/jquery-1.6.3.min.js"></script>
    <script src="http://code.jquery.com/mobile/1.0b3/jquery.mobile-1.0b3.min.js"></script>
	
		<!--[if lt IE 9]>
			<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->

        <script type="text/javascript" src="./js/basic.js"></script>

		<!-- Adding "maximum-scale=1" fixes the Mobile Safari auto-zoom bug: http://filamentgroup.com/examples/iosScaleBug/ -->
		
	</head>
	
	<body lang="en">
	
<script type="text/javascript" charset="utf-8">

	window.addEventListener('load', function() {
	
		var leftBarSize;
		var rightBarSize;
		
		$('.cbListEntriesPlus .cbBar').each(function(intIndex) {
			leftBarSize = Math.round(Math.random() * 80);
			$(this).attr('style', 'width : ' + (20 + leftBarSize) + '%; background : #3C6;');
			$(this).html('   +' + leftBarSize);
		});		
		
		$('.cbListEntriesMinus .cbBar').each(function(intIndex) {
			leftBarSize = Math.round(Math.random() * 80);
			$(this).attr('style', 'width : ' + (20 + leftBarSize) + '%; left : ' + (80 - leftBarSize) + '%; background : #C31;');
			$(this).html('-' + leftBarSize + '   ');
		});	
		
	}, false);
	
</script>


<!-- Start of first page: #splash -->

<div data-role="page" id="splash">

    <div data-role="header" data-position="fixed">
        <img src="./img/titre.png" />
    </div>

    <div class="content" data-role="content">  
		<p>
			Bienvenu sur la WebApp pense-dette ! Beta-testeurs, Attention !! <br />
			1 - Vous allez connecter votre compte facebook afin de recuperer vos contacts. <br />
			2 - Vous pouvez visualiser l'etat de vos comptes avec vos proches. <br />
			3 - Soumettre de futurs notes...<br />
			4 - ...
		</p>

		<a href="#fbConnect" data-transition="slide"><img src="./img/fb-connect.png" /></a>
	</div>
	
    <div data-role="footer" class ="firstfooters" data-id="homefooter" data-position="fixed">

    </div>
		
</div>

<!-- End of first page: #splash -->

<!-- Start of Popup page: #fbConnect -->

<div data-role="page" id="fbConnect">

    <div data-role="header" data-position="fixed">
        <img src="./img/titre.png" />
    </div>
	
<script>	

function ajaxtest () {
		alert("test start");
	  $.ajax({
	  url: 'http://pensedette.dev/api/1.0/transactions',
		// url : 'https://api.foursquare.com/v2/users/self/friends?oauth_token=HOXY1WXFIT1SDSQHCIN4SXJ1AWF1FMX4AQY2SBLLSFPBN4MW&v=20110917',

	  dataType: 'json',
	  xhrFields: {
		 withCredentials: true
	  },
	  success: function(data) {
		 console.log(data);
		
		  var items = [];

		  $.each(data, function(key, val) {
				items.push('<li id="' + key + '">' + val + '</li>');
			  });

			  $('<ul/>', {
				html: items.join('')
			  }).append('id="fbConnectDiv"');

		// $("#pending .content").append(;

	  },
	  error: function(error) {
		 console.log(error);
		// console.log(error);
	  }
	});
}

</script>

    <div id="fbConnectDiv" class="content" data-role="content">  
		<p>
			facebook login...
		</p>
		<a href="#" data-role="button" data-icon="plus" data-theme="c" onclick="ajaxtest();">Test</a>

		<a href="#accueil" data-role="button" data-icon="back" data-transition="slide" data-theme="c">Validez</a>
	</div>
	
    <div data-role="footer" class ="firstfooters" data-id="homefooter" data-position="fixed">

    </div>
		
</div>

<!-- End of Popup page: #fbConnect -->

<!-- Start of second page: #accueil -->

<div data-role="page" id="accueil">

    <div data-role="header" data-position="fixed">
        <img src="./img/titre.png" />
    </div>

    <div class="content" data-role="content">  
		<a href="#newOrder" data-transition="slide"><img src="./img/btn_envoyer-une-dette.png" /></a>
		<br />
		<a href="#cashBoard" data-transition="slide"><img src="./img/btn_visualiser-mes-comptes.png" /></a>
		<br />		
		<a href="#pending" data-transition="slide"><img src="./img/btn_reponse-en-attente.png" /></a>
	</div>
	
    <div data-role="footer" class ="firstfooters" data-id="homefooter" data-position="fixed">

    </div>
	
</div>

<!-- End of second page: #accueil -->

<!-- Start of third page: #pending -->

<div data-role="page" id="pending">

    <div data-role="header" data-position="fixed">
		<!-- <a href="#accueil" data-role="button" data-inline="true" data-icon="home" data-direction="reverse" data-theme="e">Accueil</a> -->
        <img src="./img/titre.png" />
    </div>

    <div class="content" data-role="content"> 

		<p>
			Je dois ... X ...
		</p>
		
		<p>
			Samir me doit ... Z ...
		</p>
		
		<p>
			Je dois ... Y ...
		</p>
	</div>
		
	<div data-role="footer" data-id="homefooter" data-position="fixed">
		<div data-role="navbar">
			<ul>
				<li><a href="#newOrder" data-icon="plus" data-transition="slideup" data-iconpos="top">Note</a></li>
				<li><a href="#cashBoard" data-icon="grid" data-transition="slideup" data-iconpos="top">Solde</a></li>
				<li><a href="#pending" class="activeLinks" data-transition="slideup" data-icon="info" data-iconpos="top">Attente</a></li>
				<li><a href="#" data-icon="delete" data-iconpos="top" onclick="">Deconnexion</a>
			</ul>
		</div>
    </div>
	


</div>

<!-- End of third page: #pending -->


<!-- Start of cashBoard page: #cashBoard -->


<div data-role="page" id="cashBoard">

    <div data-role="header" data-position="fixed">
		<!-- <a href="#accueil" data-role="button" data-inline="true" data-icon="home" data-direction="reverse" data-theme="e">Accueil</a> -->
        <img src="./img/titre.png" />
    </div><!-- /header -->

    <div class="content" data-role="content">  
        
<ul id="cbList">
 
<?php
$url = 'https://api.foursquare.com/v2/users/self/friends';
$get = array('oauth_token' => "HOXY1WXFIT1SDSQHCIN4SXJ1AWF1FMX4AQY2SBLLSFPBN4MW", 'v' => '20110917');
$options = array();

$friend = curl_get($url, $get, $options);
$friends = json_decode($friend);

    $fs = $friends->response->friends->items;
	// $fs = array();
    $i=0;
    foreach ($fs as $f) {
        $i++;
		if (rand(1, 10) > 5) {
		echo('<li class="cbListEntriesPlus">
				<a href="#historic" data-transition="slide">
				<div class="cbImgContainer">
					<p class="cbName">' . $f->firstName . '</p>
					<img class="cbImg" src="' . $f->photo . '" />
				</div>
				<div class="cbBarContainer"> 
					<pre><p class="cbBar"></p></pre>
				</div>
				</a>
			</li>');
		} else {
			echo('<li class="cbListEntriesMinus">
					<a href="#historic" data-transition="slide">
					<div class="cbBarContainer"> 
						<pre><p class="cbBar"></p></pre>
					</div>
					<div class="cbImgContainer">
						<p class="cbName">' . $f->firstName . '</p>
						<img class="cbImg" src="' . $f->photo . '" />
					</div>
					</a>
				</li>');		
		}
	}
?>

</ul>		
		
    </div>
	
	<div data-role="footer" data-id="homefooter" data-position="fixed">
		<div data-role="navbar">
			<ul>
				<li><a href="#newOrder" data-icon="plus" data-transition="slideup" data-iconpos="top">Note</a></li>
				<li><a href="#cashBoard" class="activeLinks" data-transition="slideup" data-icon="grid" data-iconpos="top">Solde</a></li>
				<li><a href="#pending" data-icon="info" data-transition="slideup" data-iconpos="top">Attente</a></li>
				<li><a href="#" data-icon="delete" data-iconpos="top" onclick="">Deconnexion</a>
			</ul>
		</div>
    </div>
 
</div>

<!-- /page cashBoard -->


<!-- Start of Historic page: #two -->


<div data-role="page" id="historic">

    <div data-role="header" data-position="fixed">
        <img src="./img/titre.png" />
    </div><!-- /header -->

    <div class="content" data-role="content"> 
	
	
<ul id="cbList2">
 
<?php

    //$fs = $friends->response->friends->items;
	$fs = array();
    $i=0;
    foreach ($fs as $f) {
        $i++;
		if (rand(1, 10) > 5) {
		echo('<li class="cbListEntriesPlus">
				<a href="#two" data-transition="slidedown">
				<div class="cbImgContainer">
					<p class="cbName"></p>
					<img class="cbImg" src="http://ccedms.free.fr/Plus.png" />
				</div>
				<div class="cbBarContainer"> 
					<pre><p class="cbBar"></p></pre>
				</div>
				</a>
			</li>');
		} else {
			echo('<li class="cbListEntriesMinus">
					<a href="#two" data-transition="slidedown">
					<div class="cbBarContainer"> 
						<pre><p class="cbBar"></p></pre>
					</div>
					<div class="cbImgContainer">
						<p class="cbName"></p>
						<img class="cbImg" src="http://upload.wikimedia.org/wikipedia/commons/0/00/Torchlight_viewmag_minus.png" />
					</div>
					</a>
				</li>');		
		}
	}

?>	

</ul>

    </div>
	
	<div data-role="footer" data-id="homefooter" data-position="fixed">
		<div data-role="navbar">
			<ul>
				<li><a href="#newOrder" data-icon="plus" data-transition="slideup" data-iconpos="top">Note</a></li>
				<li><a href="#cashBoard" data-icon="grid" data-transition="slideup" data-iconpos="top">Solde</a></li>
				<li><a href="#pending" data-icon="info" data-transition="slideup" data-iconpos="top">Attente</a></li>
				<li><a href="#" data-icon="delete" data-iconpos="top" onclick="">Deconnexion</a>
			</ul>
		</div>
    </div>

</div><!-- /Historic page -->     



<!-- Start of newOrder page: #newOrder -->
<div data-role="page" id="newOrder">

    <div data-role="header" data-position="fixed">
		<!-- <a href="#accueil" data-role="button" data-inline="true" data-icon="home" data-direction="reverse" data-theme="e">Accueil</a> -->
        <img src="./img/titre.png" />
    </div><!-- /header -->

    <div class="content" data-role="content"> 
	
	<div data-role="fieldcontain">
		<fieldset data-role="controlgroup" data-type="horizontal">
				<input type="radio" src="./img/btn_je-dois.png" name="radio-choice-1" id="radio-choice-1" value="choice-1" checked="checked" />
				<label for="radio-choice-1">Je dois</label>

				<input type="radio" name="radio-choice-1" id="radio-choice-2" value="choice-2"  />
				<label for="radio-choice-2">On me dois</label>
		</fieldset>
	</div>

	<div data-role="fieldcontain">
		<label for="combien">Somme due :</label>
		<input type="text" name="combien" id="combien" value=""  />
	</div>

	<div data-role="fieldcontain">
		<label for="combien">Sujet :</label>
		<input type="text" name="combien" id="combien" value=""  />
	</div>
	
	<div data-role="fieldcontain">		
		<label for="who">Recherche d'ami :</label>
		<input type="search" name="who" id="who" value="" />
	</div>	
	
	<div data-role="fieldcontain" class="ui-field-contain ui-body ui-br">
		<label for="select-choice-custom" placeholder=" " class="select ui-select">Categorie :</label>
				<div class="ui-select">
					<select name="select-choice-1" id="select-choice-custom" data-native-menu="false" tabindex="-1">
						<option value="standard">Restauration</option>
						<option value="rush">Logement</option>
						<option value="express">Transport</option>
						<option value="overnight">Depenses</option>
					</select>
				</div>
			</div>	
			
	<a href="#pending" id="validateOrder" data-role="button" data-inline="true" data-icon="check" data-iconpos="top" data-theme="b">Ajouter</a>

    </div><!-- /content -->
	
	<div data-role="footer" data-id="homefooter" data-position="fixed">
		<div data-role="navbar">
			<ul>
				<li><a href="#newOrder" class="activeLinks" data-transition="slideup" data-icon="plus" data-iconpos="top">Note</a></li>
				<li><a href="#cashBoard" data-icon="grid" data-transition="slideup" data-iconpos="top">Solde</a></li>
				<li><a href="#pending" data-icon="info" data-transition="slideup" data-iconpos="top">Attente</a></li>
				<li><a href="#" data-icon="delete" data-iconpos="top" onclick="">Deconnexion</a>
			</ul>
		</div>
    </div>

</div><!-- /page newOrder-->   

	</body>
	
</html>







