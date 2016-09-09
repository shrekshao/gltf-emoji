var glTFEmojiRenderer = glTFEmojiRenderer || {};
(function() {
    'use strict';

    var R = glTFEmojiRenderer;


    var height = 20,
        size = 70,
        hover = 30,

        curveSegments = 4,

        bevelThickness = 2,
        bevelSize = 1.5,
        bevelSegments = 3,
        bevelEnabled = true,

        font = undefined,

        fontName = "optimer", // helvetiker, optimer, gentilis, droid sans, droid serif
        fontWeight = "bold"; // normal bold


    function loadFont(fontName, fontWeight) {

        var loader = new THREE.FontLoader();
        loader.load( '/fonts/' + fontName + '_' + fontWeight + '.typeface.json', function ( response ) {

            font = response;

            //refreshText();

        } );

    }


    loadFont("optimer", "bold");

    var material = new THREE.MultiMaterial( [
        new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } ), // front
        new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ) // side
    ] );

    /**
     * @param {Object} params
     * @param {} params.font
     */
    R.createText3D = function (text, params) {
        var textGeo = new THREE.TextGeometry( text, {

            font: font,

            size: size,
            height: height,
            curveSegments: curveSegments,

            bevelThickness: bevelThickness,
            bevelSize: bevelSize,
            bevelEnabled: bevelEnabled,

            material: 0,
            extrudeMaterial: 1

        });

        textGeo.computeBoundingBox();
        textGeo.computeVertexNormals();

        // "fix" side normals by removing z-component of normals for side faces
        // (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)

        if ( ! bevelEnabled ) {

            var triangleAreaHeuristics = 0.1 * ( height * size );

            for ( var i = 0; i < textGeo.faces.length; i ++ ) {

                var face = textGeo.faces[ i ];

                if ( face.materialIndex == 1 ) {

                    for ( var j = 0; j < face.vertexNormals.length; j ++ ) {

                        face.vertexNormals[ j ].z = 0;
                        face.vertexNormals[ j ].normalize();

                    }

                    var va = textGeo.vertices[ face.a ];
                    var vb = textGeo.vertices[ face.b ];
                    var vc = textGeo.vertices[ face.c ];

                    var s = THREE.GeometryUtils.triangleArea( va, vb, vc );

                    if ( s > triangleAreaHeuristics ) {

                        for ( var j = 0; j < face.vertexNormals.length; j ++ ) {

                            face.vertexNormals[ j ].copy( face.normal );

                        }

                    }

                }

            }

        }

        var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

        var textMesh1 = new THREE.Mesh( textGeo, material );

        textMesh1.position.x = centerOffset;
        textMesh1.position.y = hover;
        textMesh1.position.z = 0;

        textMesh1.rotation.x = 0;
        textMesh1.rotation.y = Math.PI * 2;

        var group = new THREE.Group();

        group.add( textMesh1 );

        // if ( mirror ) {

        //     textMesh2 = new THREE.Mesh( textGeo, material );

        //     textMesh2.position.x = centerOffset;
        //     textMesh2.position.y = -hover;
        //     textMesh2.position.z = height;

        //     textMesh2.rotation.x = Math.PI;
        //     textMesh2.rotation.y = Math.PI * 2;

        //     group.add( textMesh2 );

        // }

        return group;
    };
})();