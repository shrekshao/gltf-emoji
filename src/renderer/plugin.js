function myOnLoad() {
	CKEDITOR.plugins.add( 'emoji',{
		init: function( editor )
		{
			editor.addCommand( 'popUpDialog', {
				exec : function( editor ){    
					 $("#myModal").modal() 
				 	var canvas1 = document.getElementById("canvas1");
					var meme = new glTFEmojiRenderer.Meme(canvas1, "/glTFs/CesiumMan.gltf");
					meme.createEmoji();

					var canvas2 = document.getElementById("canvas2");
					var meme2 = new glTFEmojiRenderer.Meme(canvas2, "/glTFs/CesiumMilkTruck.gltf");
					meme2.createEmoji();

					var canvas3 = document.getElementById("canvas3");
					var meme3 = new glTFEmojiRenderer.Meme(canvas3, "/glTFs/duck/glTF-MaterialsCommon/duck.gltf");
					meme3.createEmoji();

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
			['Source', '-', 'Bold', 'Italic', '-', 'NumberedList', 'BulletedList', '-', 'Link', 'Unlink', 'Smiley'],
			['About','-','btnInsert']
		]
	});

	// var canvas1 = document.getElementById("canvas1");
	// var meme = new glTFEmojiRenderer.Meme(canvas1, "/glTFs/CesiumMan.gltf");
	// meme.createEmoji();

	// var canvas2 = document.getElementById("canvas2");
	// var meme2 = new glTFEmojiRenderer.Meme(canvas2, "/glTFs/CesiumMilkTruck.gltf");
	// meme2.createEmoji();

	// var canvas3 = document.getElementById("canvas3");
	// var meme3 = new glTFEmojiRenderer.Meme(canvas3, "/glTFs/duck/glTF-MaterialsCommon/duck.gltf");
	// meme3.createEmoji();
}

function okClick(){
	canvasIds = [];
	var conte
	for(var cb in checkboxCanvasMap){
		if(document.getElementById(cb).checked){
			canvasIds.push(checkboxCanvasMap[cb]);
		}
	}
	var canvasString = ""
	for(var id in canvasIds){
		canvasString += '[' + canvasIds[id] + ']';
	}
	

	window.frames[0].document.body.innerHTML = window.frames[0].document.body.innerHTML + canvasString;
	// document.getElementById("editor1").innerHTML = document.getElementById("editor1").innerHTML + "hello";
	// alert(document.getElementById('cb1').checked);
}

var canvasIds = [];
var displayDivIdsNum = 0;
var displayCanvasIdsNum = 0;
var displayCanvasCanvasMap = {};
//mapping gltf files to canvas
var map = [];
map["canvas1"] = "/glTFs/CesiumMan.gltf";
map["canvas2"] = "/glTFs/CesiumMilkTruck.gltf";
map["canvas3"] = "/glTFs/duck/glTF-MaterialsCommon/duck.gltf";

var checkboxCanvasMap = {
	cb1:"canvas1",
	cb2:"canvas2",
	cb3:"canvas3"
};

function displayAll(){
	var content = CKEDITOR.instances.editor1.getData();
	var curDispCanvasIds = [];
	for(cid in canvasIds){
		var displayCanvasId = "displayCanvas"+displayCanvasIdsNum++;
		displayCanvasCanvasMap[displayCanvasId] = canvasIds[cid];
		//remove dummy
		var subStr = '[' + canvasIds[cid] + ']';
		content = content.replace(subStr, "");
		content += '<canvas id="' + displayCanvasId + '" class="canvases" width="180px"></canvas>';
		curDispCanvasIds.push(displayCanvasId);
	}
	var newDiv = document.createElement("div");
	var newId = "displayDiv"+displayDivIdsNum++;
	newDiv.id = newId;
	newDiv.innerHTML = content;
	newDiv.className = "well";

	document.getElementById("display").appendChild(newDiv);
	for(cid in curDispCanvasIds){
		var canvas = document.getElementById(curDispCanvasIds[cid]);
		var meme = new glTFEmojiRenderer.Meme(canvas, map[displayCanvasCanvasMap[curDispCanvasIds[cid]]]);
		meme.createEmoji();
	}
	window.frames[0].document.body.innerHTML = "";
	canvasIds = [];
}	