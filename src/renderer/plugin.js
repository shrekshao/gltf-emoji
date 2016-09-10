function myOnLoad() {
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
	var meme = new glTFEmojiRenderer.Meme(canvas, "/glTFs/CesiumMan.gltf");
	meme.createEmoji();

	var canvas2 = document.getElementById("canvas2");
	var meme2 = new glTFEmojiRenderer.Meme(canvas2, "/glTFs/CesiumMilkTruck.gltf");
	meme2.createEmoji();

	var canvas3 = document.getElementById("canvas3");
	var meme3 = new glTFEmojiRenderer.Meme(canvas3, "/glTFs/duck/glTF/duck.gltf");
	meme3.createEmoji();
}