
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

