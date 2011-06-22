$(function() {
	var projects = [
		{
			value: "jquery",
			label: "jQuery",
			desc: "the write less, do more, JavaScript library",
			icon: "jquery_32x32.png"
		},
		{
			value: "jquery-ui",
			label: "jQuery UI",
			desc: "the official user interface library for jQuery",
			icon: "jqueryui_32x32.png"
		},
		{
			value: "sizzlejs",
			label: "Sizzle JS",
			desc: "a pure-JavaScript CSS selector engine",
			icon: "sizzlejs_32x32.png"
		}
	];

	$("#project").lookup({
		minLength: 0,
		source: projects,
		focus: function( event, ui ) {
			$( "#project" ).val( ui.item.label );
			return false;
		},
		select: function(item) {
			$( "#project" ).val( item.label );
			$( "#project-id" ).val( item.value );
			$( "#project-description" ).html( item.desc );
			$( "#project-icon" ).attr( "src", "images/" + item.icon );

			return false;
		},
		renderItem: function( ul, item ) {
			return $( "<li></li>" )
				.data( "item.autocomplete", item )
				.append( "<a>" + item.label + "<br>" + item.desc + "</a>" )
				.appendTo( ul );
		}
	});
});