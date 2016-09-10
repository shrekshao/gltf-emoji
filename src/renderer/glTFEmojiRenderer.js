var glTFEmojiRenderer = glTFEmojiRenderer || {};
(function() {
    'use strict';

    var R = glTFEmojiRenderer;

    /**
     * 
     */
    R.Meme = function (c, glTFURL, t, params) {
        var p = params || {};

        // setup canvas
        var canvas = c;
        var width = canvas.width;
        var height = canvas.height;

        // gltf url
        var url = glTFURL;

        // 3D text
        var text = t || "DA FUQ?";
        var text3D;
        
        // renderer related
        var orbitControls = null;
        var container;
        var camera;
        var scene;
        var renderer;
        var loader;

        var cameraIndex = 0;
        var cameras = [];
        var cameraNames = [];
        var defaultCamera = null;
        var gltf = null;


        var useMaterialsExtension = false;
        //var glTFLoader = new THREE.glTFLoader;


        // function onload() {
        //     //window.addEventListener( 'resize', onWindowResize, false );
        //     //document.addEventListener( 'keydown', function(e) { onKeyDown(e); }, false );

        //     buildSceneList();
        //     switchScene(0);
        //     animate();
        // }

        function initScene(sceneInfo, textInfo) {

            scene = new THREE.Scene();

            defaultCamera = new THREE.PerspectiveCamera( 45, width / height, 1, 20000 );

            //defaultCamera.up = new THREE.Vector3( 0, 1, 0 );
            scene.add( defaultCamera );
            camera = defaultCamera;

            //var sceneInfo = sceneList[index];

            var spot1 = null;

            if (sceneInfo.addLights) {

                var ambient = new THREE.AmbientLight( 0x222222 );
                scene.add( ambient );

                var directionalLight = new THREE.DirectionalLight( 0xdddddd );
                directionalLight.position.set( 0, 0, 1 ).normalize();
                scene.add( directionalLight );

                spot1   = new THREE.SpotLight( 0xffffff, 1 );
                spot1.position.set( 10, 20, 10 );
                spot1.angle = 0.25;
                spot1.distance = 1024;
                spot1.penumbra = 0.75;

                if ( sceneInfo.shadows ) {

                    spot1.castShadow = true;
                    spot1.shadow.bias = 0.0001;
                    spot1.shadow.mapSize.width = 2048;
                    spot1.shadow.mapSize.height = 2048;

                }

                scene.add( spot1 );

            }

            // RENDERER

            renderer = new THREE.WebGLRenderer({antialias:true, canvas: canvas});
            renderer.setClearColor( sceneInfo.clearColor || 0x000000 );
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize( width, height );

            if (sceneInfo.shadows) {
                renderer.shadowMap.enabled = true;
                renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            }

            var ground = null;

            if (sceneInfo.addGround) {
                var groundMaterial = new THREE.MeshPhongMaterial({
                        color: 0xFFFFFF,
                        shading: THREE.SmoothShading,
                    });
                ground = new THREE.Mesh( new THREE.PlaneBufferGeometry(512, 512), groundMaterial);

                if (sceneInfo.shadows) {
                    ground.receiveShadow = true;
                }

                if (sceneInfo.groundPos) {
                    ground.position.copy(sceneInfo.groundPos);
                } else {
                    ground.position.z = -70;
                }

                ground.rotation.x = -Math.PI / 2;

                scene.add(ground);
            }

            loader = new THREE.glTFLoader;
            var loadStartTime = Date.now();
            //var status = document.getElementById("status");
            //status.innerHTML = "Loading...";
            console.log("Loading...");
            //var url = sceneInfo.url;
            var r = eval("/" + '\%s' + "/g");
            var dir = useMaterialsExtension ? 'glTF-MaterialsCommon' :  'glTF';
            url = url.replace(r, dir);

            var loadStartTime = Date.now();
            //var status = document.getElementById("status");
            //status.innerHTML = "Loading...";
            console.log("Loading...");
            loader.load( url, function(data) {

                gltf = data;

                var object = gltf.scene;

                var loadEndTime = Date.now();

                var loadTime = (loadEndTime - loadStartTime) / 1000;

                //status.innerHTML = "Load time: " + loadTime.toFixed(2) + " seconds.";
                console.log("Load time: " + loadTime.toFixed(2) + "seconds");

                if (sceneInfo.cameraPos)
                    defaultCamera.position.copy(sceneInfo.cameraPos);

                if (sceneInfo.center) {
                    orbitControls.target.copy(sceneInfo.center);
                }

                if (sceneInfo.objectPosition) {
                    object.position.copy(sceneInfo.objectPosition);

                    if (spot1) {
                        spot1.position.set(sceneInfo.objectPosition.x - 100, sceneInfo.objectPosition.y + 200, sceneInfo.objectPosition.z - 100 );
                        spot1.target.position.copy(sceneInfo.objectPosition);
                    }
                }

                if (sceneInfo.objectRotation)
                    object.rotation.copy(sceneInfo.objectRotation);

                if (sceneInfo.objectScale)
                    object.scale.copy(sceneInfo.objectScale);

                cameraIndex = 0;
                cameras = [];
                cameraNames = [];

                if (gltf.cameras && gltf.cameras.length) {

                    var i, len = gltf.cameras.length;

                    for (i = 0; i < len; i++) {

                        var addCamera = true;
                        var cameraName = gltf.cameras[i].parent.name;

                        if (sceneInfo.cameras && !(cameraName in sceneInfo.cameras)) {
                                addCamera = false;
                        }

                        if (addCamera) {
                            cameraNames.push(cameraName);
                            cameras.push(gltf.cameras[i]);
                        }

                    }

                    //updateCamerasList();
                    //switchCamera(1);

                } else {

                    //updateCamerasList();
                    //switchCamera(0);

                }

                if (gltf.animations && gltf.animations.length) {

                    var i, len = gltf.animations.length;
                    for (i = 0; i < len; i++) {
                        var animation = gltf.animations[i];
                        animation.loop = true;
                        // There's .3333 seconds junk at the tail of the Monster animation that
                        // keeps it from looping cleanly. Clip it at 3 seconds
                        if (sceneInfo.animationTime) {
                            animation.duration = sceneInfo.animationTime;
                        }
                        animation.play();
                    }
                }

                scene.add( object );
                //onWindowResize();

                
                // test text3D
                
                if ( text ) {
                    text3D = R.createText3D(text, textInfo);
                    
                    if (textInfo.position) {
                        //text3D.position.set(0, 0, 50);
                        text3D.position.copy(textInfo.position);
                    }

                    if (textInfo.scale) {
                        text3D.scale.copy(textInfo.scale)
                    }

                    if (textInfo.animation) {
                        switch(textInfo.animation) {
                            case "spin": animateText3DHandler = animateText3DSpin; break;
                            case "shake": animateText3DHandler = animateText3DShake; break;
                        }
                    }
                    
                    scene.add(text3D);
                }
                
                animate();

            });

            orbitControls = new THREE.OrbitControls(defaultCamera, renderer.domElement);

        }

        function toggleAnimations() {

            var i, len = gltf.animations.length;

            for (i = 0; i < len; i++) {

                var animation = gltf.animations[i];

                if (animation.running) {
                    animation.stop();
                } else {
                    animation.play();
                }

            }

        }

        function animate() {
            requestAnimationFrame( animate );
            THREE.glTFAnimator.update();
            THREE.glTFShaders.update(scene, camera);
            if (cameraIndex == 0) {
                orbitControls.update();
            }

            if (animateText3DHandler) {
                animateText3DHandler();
            }

            render();
        }

        var frame = 0;
        var animateText3DHandler = null;
        function animateText3DSpin() {
            //text3D.rotation.y += 0.005;
            frame += 1;
            text3D.rotation.y = 0.2 * Math.sin(0.05 * frame);
            text3D.rotation.x = 0.4 * Math.sin(0.03 * frame);
        }
        function animateText3DShake() {
            //text3D.rotation.y += 0.005;
            frame += 1;
            text3D.position.y = 0.2 * Math.sin(0.5 * frame);
            text3D.rotation.x = 0.1 * Math.sin(0.03 * frame);
        }

        function render() {
            renderer.render( scene, camera );
        }


        console.log("glTF meme start render");




        var sceneInfo = p.sceneInfo || {
            //name : "Monster", 
            //url : url,
            //cameraPos: new THREE.Vector3(30, 10, 70),
            clearColor: 0xffffff,
            cameraPos: new THREE.Vector3(0, 3, 10),
            //objectScale: new THREE.Vector3(0.01, 0.01, 0.01),
            //objectScale: new THREE.Vector3(100, 100, 100),
            //objectPosition: new THREE.Vector3(2, 6, 0),
            objectRotation: new THREE.Euler(0, - 3 * Math.PI / 4, 0),
            //animationTime: 3,
            addLights:true,
            shadows:true
            //,addGround:true
        };

        var textInfo = p.textInfo || {
            //text: text || "DA FUQ?",
            position: new THREE.Vector3(0, 0, 1), 
            scale: new THREE.Vector3(0.01, 0.01, 0.01), 
            //color: 0xffffff
            color: 0xcccccc
            //color: 0xff6666
        };


        initScene(sceneInfo, textInfo);
        //animate();




    };


})();