var glTFEmojiRenderer = glTFEmojiRenderer || {};
(function() {
    'use strict';
    
    var R = glTFEmojiRenderer;

    // canvas related
    var canvas;
    var width;
    var height;

    
    // renderer related
    var orbitControls = null;
    var container, camera, scene, renderer, loader;

    var cameraIndex = 0;
    var cameras = [];
    var cameraNames = [];
    var defaultCamera = null;
    var gltf = null;


    var useMaterialsExtension = false;
    //var glTFLoader = new THREE.glTFLoader;


    function onload() {
        window.addEventListener( 'resize', onWindowResize, false );
        document.addEventListener( 'keydown', function(e) { onKeyDown(e); }, false );

        buildSceneList();
        switchScene(0);
        animate();
    }

    function initScene(sceneInfo) {

        //container = document.getElementById( 'container' );

        scene = new THREE.Scene();

        defaultCamera = new THREE.PerspectiveCamera( 45, width / height, 1, 20000 );


        var bodyGeom = new THREE.BoxGeometry(15,15,15);
        var bodyMat = new THREE.MeshPhongMaterial({color:0xf25346, shading:THREE.FlatShading});
        var body = new THREE.Mesh(bodyGeom, bodyMat);
        scene.add(body);


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
        renderer.setClearColor( 0x000000 );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( width, height );

        if (sceneInfo.shadows) {
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }

        //container.appendChild( renderer.domElement );

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
        var url = sceneInfo.url;
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
                    if (sceneInfo.animationTime)
                        animation.duration = sceneInfo.animationTime;
                    animation.play();
                }
            }

            scene.add( object );
            //onWindowResize();

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
        render();
    }

    function render() {
        renderer.render( scene, camera );
    }



    R.createEmoji = function(c, glTFURL) {
        console.log("glTF emoji entry");
        //console.log(canvas);

        canvas = c;
        width = canvas.width;
        height = canvas.height;

        // scene: test sceneInfo
        var sceneList = [
            {
                name : "Monster", url : "/glTFs/monster/%s/monster.gltf",
                cameraPos: new THREE.Vector3(30, 10, 70),
                objectScale: new THREE.Vector3(0.01, 0.01, 0.01),
                objectPosition: new THREE.Vector3(2, 6, 0),
                objectRotation: new THREE.Euler(0, - 3 * Math.PI / 4, 0),
                animationTime: 3,
                addLights:true,
                shadows:true,
                addGround:true
            },
            {
                name : "Duck", url : "./models/gltf/duck/%s/duck.gltf",
                cameraPos: new THREE.Vector3(0, 3, 5),
                addLights:true,
                addGround:true,
                shadows:true
            },
            {
                name : "Cesium Man", url : "./models/gltf/CesiumMan/%s/Cesium_Man.gltf",
                    cameraPos: new THREE.Vector3(0, 3, 10),
                    objectRotation: new THREE.Euler(0, 0, 0),
                    addLights:true,
                    addGround:true,
                    shadows:true
            },
            {
                name : "Cesium Milk Truck",
                url : "./models/gltf/CesiumMilkTruck/%s/CesiumMilkTruck.gltf",
                cameraPos: new THREE.Vector3(0, 3, 10),
                addLights:true,
                addGround:true,
                shadows:true
            },

        ];
        var sceneInfo = sceneList[0];


        initScene(sceneInfo);
        animate();




    };

})();