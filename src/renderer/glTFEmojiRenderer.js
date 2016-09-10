var glTFEmojiRenderer = glTFEmojiRenderer || {};
(function() {
    'use strict';

    var self;

    var useMaterialsExtension = false;
    var R = glTFEmojiRenderer;

    R.Meme = function (c, glTFURL, t, params) {        

        this.canvas = c;
        this.width = c.width;
        this.height = c.height;
        this.url = glTFURL;
        this.text = t || "DA FUQ?";
        var p = this.params = params || {};
        
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
            color: 0xcccccc
        };
        


        this.frame = 0;
        this.animateText3DHandler = null;

        this.initScene(sceneInfo, textInfo);
        

    };


    R.Meme.prototype.animateText3DSpin = function() {
        //text3D.rotation.y += 0.005;
        this.frame += 1;
        this.text3D.rotation.y = 0.2 * Math.sin(0.05 * this.frame);
        this.text3D.rotation.x = 0.4 * Math.sin(0.03 * this.frame);
    };

    R.Meme.prototype.animateText3DShake = function() {
        //text3D.rotation.y += 0.005;
        this.frame += 1;
        this.text3D.position.y = 0.2 * Math.sin(0.5 * this.frame);
        this.text3D.rotation.x = 0.1 * Math.sin(0.03 * this.frame);
    };



    R.Meme.prototype.animate = function () {
        
        THREE.glTFAnimator.update();
        THREE.glTFShaders.update(this.scene, this.camera);
        if (this.camera == this.defaultCamera) {
            this.orbitControls.update();
        }

        //if (this.text3D && this.animateText3DHandler) {
        if (this.animateText3DHandler) {
            this.animateText3DHandler();
        }

        this.render();

        //requestAnimationFrame( this.animate );
    };

    // var animate = function(meme) {
    //     var self = meme;

    //     return function () {
    //         THREE.glTFAnimator.update();
    //         THREE.glTFShaders.update(self.scene, self.camera);
    //         if (self.camera == self.defaultCamera) {
    //             self.orbitControls.update();
    //         }

    //         //if (this.text3D && this.animateText3DHandler) {
    //         if (self.animateText3DHandler) {
    //             self.animateText3DHandler();
    //         }

    //         self.render();

    //         requestAnimationFrame( animate );
    //     }
    // };
    
    // var animate = function() {

    //         THREE.glTFAnimator.update();
    //         THREE.glTFShaders.update(self.scene, self.camera);
            
    //         if (self.camera == self.defaultCamera) {
    //             self.orbitControls.update();
    //         }

    //         //if (this.text3D && this.animateText3DHandler) {
    //         if (self.animateText3DHandler) {
    //             self.animateText3DHandler();
    //         }

    //         self.render();

    //         requestAnimationFrame( animate );
    // };






    R.Meme.prototype.render = function () {
        this.renderer.render( this.scene, this.camera );
    }



    R.Meme.prototype.initScene = function(sceneInfo, textInfo) {

        var scene = this.scene = new THREE.Scene();

        var defaultCamera = this.defaultCamera = new THREE.PerspectiveCamera( 45, this.width / this.height, 1, 20000 );


        this.scene.add( this.defaultCamera );
        var camera = this.camera = this.defaultCamera;

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

        var renderer = this.renderer = new THREE.WebGLRenderer({antialias:true, canvas: this.canvas});
        renderer.setClearColor( sceneInfo.clearColor || 0x000000 );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( this.width, this.height );

        this.orbitControls = new THREE.OrbitControls(defaultCamera, renderer.domElement);

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

        var loader = new THREE.glTFLoader;
        var loadStartTime = Date.now();
        //var status = document.getElementById("status");
        //status.innerHTML = "Loading...";
        console.log("Loading...");
        var url = this.url;
        var r = eval("/" + '\%s' + "/g");
        var dir = useMaterialsExtension ? 'glTF-MaterialsCommon' :  'glTF';
        url = url.replace(r, dir);

        var loadStartTime = Date.now();
        //var status = document.getElementById("status");
        //status.innerHTML = "Loading...";

        //var self = this;
        self = this;
        console.log("Loading...");
        loader.load( url, function(data) {

            var gltf = data;

            var object = gltf.scene;

            var loadEndTime = Date.now();

            var loadTime = (loadEndTime - loadStartTime) / 1000;

            //status.innerHTML = "Load time: " + loadTime.toFixed(2) + " seconds.";
            console.log("Load time: " + loadTime.toFixed(2) + "seconds");

            if (sceneInfo.cameraPos) {
                self.defaultCamera.position.copy(sceneInfo.cameraPos);
            }

            if (sceneInfo.center) {
                self.orbitControls.target.copy(sceneInfo.center);
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

            // cameraIndex = 0;
            // cameras = [];
            // cameraNames = [];

            // if (gltf.cameras && gltf.cameras.length) {

            //     var i, len = gltf.cameras.length;

            //     for (i = 0; i < len; i++) {

            //         var addCamera = true;
            //         var cameraName = gltf.cameras[i].parent.name;

            //         if (sceneInfo.cameras && !(cameraName in sceneInfo.cameras)) {
            //                 addCamera = false;
            //         }

            //         if (addCamera) {
            //             cameraNames.push(cameraName);
            //             cameras.push(gltf.cameras[i]);
            //         }

            //     }

            //     //updateCamerasList();
            //     //switchCamera(1);

            // } else {

            //     //updateCamerasList();
            //     //switchCamera(0);

            // }

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

            
            // test text3D
            var text = self.text;
            if ( text ) {
                var text3D = self.text3D = R.createText3D(text, textInfo);
                
                if (textInfo.position) {
                    //text3D.position.set(0, 0, 50);
                    text3D.position.copy(textInfo.position);
                }

                if (textInfo.scale) {
                    text3D.scale.copy(textInfo.scale)
                }

                if (textInfo.animation) {
                    switch(textInfo.animation) {
                        case "spin": self.animateText3DHandler = self.animateText3DSpin; break;
                        case "shake": self.animateText3DHandler = self.animateText3DShake; break;
                    }
                }
                
                scene.add(text3D);
            }

            //self.animate();
            //animate();
            //self.animate();
            animate();
        });

        

    };


})();