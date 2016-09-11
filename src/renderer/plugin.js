

function okClick(){
	canvasIds = [];
	var conte
	for(var cb in checkboxCanvasMap){
		if(document.getElementById(cb).checked){
			canvasIds.push(checkboxCanvasMap[cb]);
		}
	}
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

var memeSet = {
    cesiumManContour: {
        url: "/glTFs/CesiumMan-Contour/%s/Cesium_Man.gltf",
        text: "CesiumMan-Contour",
        params: {
            sceneInfo: {
                clearColor: 0xffffff,
                cameraPos: new THREE.Vector3(0, 3, 10),
                objectScale: new THREE.Vector3(3, 3, 3),
                objectRotation: new THREE.Euler(0, - 3 * Math.PI / 4, 0),

                addLights: true
            }
            ,
            textInfo: {
                position: new THREE.Vector3(0, 0, 1), 
                scale: new THREE.Vector3(0.01, 0.01, 0.01), 
                color: 0xaaaaaa,

                animation: "spin"
            }
        }
        
    },
    duck: {
        url: "/glTFs/duck/glTF-MaterialsCommon/duck.gltf",
        text: "CesiumMan-Contour",
        params: {
            sceneInfo: {
                clearColor: 0xffffff,
                cameraPos: new THREE.Vector3(0, 3, 10),
                objectScale: new THREE.Vector3(3, 3, 3),
                objectRotation: new THREE.Euler(0, - 3 * Math.PI / 4, 0),

                addLights: true
            }
            ,
            textInfo: {
                position: new THREE.Vector3(0, 0, 1), 
                scale: new THREE.Vector3(0.01, 0.01, 0.01), 
                color: 0xaaaaaa,

                animation: "shake"
            }
        }
        
    },
    cube: {
        url: "/glTFs/cube.gltf",
        text: "CesiumMan-Contour",
        params: {
            sceneInfo: {
                clearColor: 0xffffff,
                cameraPos: new THREE.Vector3(0, 3, 10),
                objectScale: new THREE.Vector3(3, 3, 3),
                objectRotation: new THREE.Euler(0, - 3 * Math.PI / 4, 0),

                addLights: true
            }
            ,
            textInfo: {
                position: new THREE.Vector3(0, 0, 1), 
                scale: new THREE.Vector3(0.01, 0.01, 0.01), 
                color: 0xaaaaaa,

                animation: "spin"
            }
        }
        
    },
};

function createMeme(canvas, cfg) {
    return new glTFEmojiRenderer.Meme(canvas, cfg.url, cfg.text, cfg.params); 
}

function displayAll(){
	var content = "<p>"+CKEDITOR.instances.editor1.getData()+"</p>";
	var curDispCanvasIds = [];
	for(cid in canvasIds){
		var displayCanvasId = "displayCanvas"+displayCanvasIdsNum++;
		displayCanvasCanvasMap[displayCanvasId] = canvasIds[cid];
		content += '<canvas id="' + displayCanvasId + '" class="canvases" width="180px"></canvas>';
		curDispCanvasIds.push(displayCanvasId);
	}
	// var newDiv = document.createElement("div");
	var newDiv = document.getElementById("divForClone").cloneNode(true);
	var newId = "displayDiv"+displayDivIdsNum++;
	newDiv.id = newId;
	newDiv.style="height:230px";
	// newDiv.innerHTML = content;
	// newDiv.className = "well";
	// newDiv.height = "200px";

	document.getElementById("display").appendChild(newDiv);
	$("#"+newId).children(".col-md-10")[0].innerHTML=content;
	for(cid in curDispCanvasIds){
		var canvas = document.getElementById(curDispCanvasIds[cid]);
		var meme = new glTFEmojiRenderer.Meme(canvas, map[displayCanvasCanvasMap[curDispCanvasIds[cid]]]);
		meme.createEmoji();
	}
}


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
			['Source', '-', 'Bold', 'Italic', '-', 'NumberedList', 'BulletedList', '-', 'Link', 'Unlink', 'Smiley'],
			['About','-','btnInsert']
		]
	});

	var canvas1 = document.getElementById("canvas1");
	// var meme = new glTFEmojiRenderer.Meme(canvas1, "/glTFs/CesiumMan.gltf");
	// meme.createEmoji();
	var meme = new glTFEmojiRenderer.Meme(canvas1, memeSet['cesiumManContour'].url, memeSet['cesiumManContour'].text, memeSet['cesiumManContour'].params); 

	// var canvas2 = document.getElementById("canvas2");
	// var meme2 = new glTFEmojiRenderer.Meme(canvas2, memeSet['duck'].url, memeSet['duck'].text, memeSet['duck'].params); 
	// // var meme2 = new glTFEmojiRenderer.Meme(canvas2, "/glTFs/CesiumMilkTruck.gltf");
	// // meme2.createEmoji();

	// var canvas3 = document.getElementById("canvas3");
	// var meme3 = new glTFEmojiRenderer.Meme(canvas3, memeSet['cube'].url, memeSet['cube'].text, memeSet['cube'].params);
	// // var meme3 = new glTFEmojiRenderer.Meme(canvas3, "/glTFs/duck/glTF-MaterialsCommon/duck.gltf");
	// // meme3.createEmoji();
}