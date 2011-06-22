$(function() {
	function log( message ) {
		$( "<div/>" ).text( message ).prependTo( "#log" );
		$( "#log" ).attr( "scrollTop", 0 );
	}

	$("#remotejsonp").button().lookup({
		source: function( request, response ) {
			$.ajax({
				url: "http://ws.geonames.org/searchJSON",
				dataType: "jsonp",
				data: {
					featureClass: "P",
					style: "full",
					maxRows: 12,
					name_startsWith: request.term
				},
				success: function( data ) {
					response( $.map( data.geonames, function( item ) {
						return {
							label: item.name + (item.adminName1 ? ", " + item.adminName1 : "") + ", " + item.countryName,
							value: item.name
						}
					}));
				}
			});
		},
		minLength: 2,
		select: function(item) {
			log("Selected: " + item.label);
				$("#remotevalue").val(item.label);
		},
		open: function() {
			$( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
		},
		close: function() {
			$( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
		}
	});
});