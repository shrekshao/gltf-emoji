
CKEDITOR.plugins.add( 'emoji',{
	init: function( editor )
	{
		editor.addCommand( 'popUpDialog', {
			exec : function( editor ){    
				 $("#myModal").modal() 
			}
		});
		editor.ui.addButton( 'btnInsert',{
			label: 'Insert a Link',
			command: 'popUpDialog',
			icon: this.path + 'images/icon.png'
		});
	}
} );

CKEDITOR.replace( 'editor1',{
	extraPlugins : 'emoji',
	toolbar :
	[
		['Source', '-', 'Bold', 'Italic', '-', 'NumberedList', 'BulletedList', '-', 'Link', 'Unlink'],
		['About','-','btnInsert']
	]
});

var canvas = document.getElementById("canvas");
glTFEmojiRenderer.createEmoji(canvas, "/glTFs/CesiumMan.gltf");

// var canvas2 = document.getElementById("canvas2");
// glTFEmojiRenderer.createEmoji(canvas2, "/glTFs/CesiumMilkTruck/glTF/CesiumMilkTruck.gltf");

// var canvas3 = document.getElementById("canvas3");
// glTFEmojiRenderer.createEmoji(canvas3, "/glTFs/duck/glTF/duck.gltf");