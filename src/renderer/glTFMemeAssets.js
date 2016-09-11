var memeSet = {
    cesiumManContour: {
        name: "Cesium Man",
        url: "/glTFs/CesiumMan-Contour/%s/Cesium_Man.gltf",
        text: "CesiumMan-Contour",
        params: {
            sceneInfo: {
                clearColor: 0xffffff,
                cameraPos: new THREE.Vector3(0, 5, 12),
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

    }
    ,
    jackieChan: {
        name: "Jackie Chan",
        url: "/glTFs/JackieChan/JackieChan.gltf",
        //text: "DA FUQ?",
        text: "Duang~",
        params: {
            sceneInfo: {
                clearColor: 0xffffff,
                cameraPos: new THREE.Vector3(-1, 4, 6),

                //objectScale: new THREE.Vector3(3, 3, 3),
                //objectRotation: new THREE.Euler(0, - 3 * Math.PI / 4, 0),

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

    }
    ,
    jackieChan2: {
        name: "Jackie Chan Crazy",
        url: "/glTFs/JackieChan2/JackieChan2.gltf",
        //text: "DA FUQ?",
        text: "Duang!!",
        params: {
            sceneInfo: {
                clearColor: 0xffffff,
                cameraPos: new THREE.Vector3(-0.5, 1, 6),
                objectPosition: new THREE.Vector3(0, -2, 0),
                //objectScale: new THREE.Vector3(3, 3, 3),
                //objectRotation: new THREE.Euler(0, - 3 * Math.PI / 4, 0),

                addLights: true
            }
            ,
            textInfo: {
                position: new THREE.Vector3(0, -2, 1),
                scale: new THREE.Vector3(0.01, 0.01, 0.01),
                color: 0xaaaaaa,

                animation: "shake"
            }
        }

    }
    ,
    milkTruck: {
        name: "Cesium Milk Truck",
        url: "/glTFs/CesiumMilkTruck/%s/CesiumMilkTruck.gltf",
        text: "Milk Truck?",
        params: {
            sceneInfo: {
                clearColor: 0xffffff,
                cameraPos: new THREE.Vector3(1, 1.5, 7.5),
                objectPosition: new THREE.Vector3(0, -1, -1),
                //objectScale: new THREE.Vector3(3, 3, 3),
                //objectRotation: new THREE.Euler(0, - 1 * Math.PI / 20, 0),

                addLights: true
            }
            ,
            textInfo: {
                position: new THREE.Vector3(0, -1, 1),
                scale: new THREE.Vector3(0.01, 0.01, 0.01),
                color: 0x87C339,

                animation: "spin"
            }
        }

    }
    ,
    duck: {
        name: "Duck",
        url: "/glTFs/duck/glTF-MaterialsCommon/duck.gltf",
        text: "Duck",
        params: {
            sceneInfo: {
                clearColor: 0xffffff,
                objectPosition: new THREE.Vector3(0, -1, 0),
                cameraPos: new THREE.Vector3(0, 1, 5),
                //objectScale: new THREE.Vector3(3, 3, 3),
                objectRotation: new THREE.Euler(0, - 4 * Math.PI / 5, 0),

                addLights: true
            }
            ,
            textInfo: {
                position: new THREE.Vector3(0, -1, 1),
                scale: new THREE.Vector3(0.01, 0.01, 0.01),
                color: 0x886611,

                animation: "spin"
            }
        }

    }
};
