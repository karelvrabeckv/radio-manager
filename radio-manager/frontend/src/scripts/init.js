import RMRadioStation from "./RMRadioStation.js";

// ========================================

document.addEventListener( "DOMContentLoaded", () =>
{
	// Initiate all radio players on the page
	( () =>
	{
		let outputs = document.querySelectorAll("div[data-rm-output-id]");
		
		for (const output of outputs)
		{	
			let data = window[ "rmData" + output.dataset.rmOutputId ];

			//console.log( data );

			let radioStation = new RMRadioStation(
				data[ "name" ],
				data[ "logo" ],
				data[ "imgDuration" ],
				data[ "playlist" ],
				data[ "posts" ],
				data[ "warnings" ]
			);
			
			let HTML = new RMHTML( "rm-radio-station" );
			HTML.createHTML();

			//radioStation.setRadioName( data[ "name" ] );
			//radioStation.setMusicianImage( data[ "logo" ] );
			//radioStation.addEventListeners();
			//radioStation.createPlaylistLoop();
			//radioStation.playlist.next();
		} // for
	} )(); // Immediately-invoked function expression
	// this can be a singleton	
});