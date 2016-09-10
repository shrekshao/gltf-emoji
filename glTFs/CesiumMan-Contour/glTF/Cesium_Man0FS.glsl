precision highp float;
varying vec3 v_normal;
varying vec3 v_position;    //view space pos, for contour
uniform vec4 u_ambient;
varying vec2 v_texcoord0;
uniform sampler2D u_diffuse;
uniform vec4 u_emission;
uniform vec4 u_specular;
uniform float u_shininess;
void main(void) {
    vec3 normal = normalize(v_normal);
    vec4 color = vec4(0., 0., 0., 0.);
    vec4 diffuse = vec4(0., 0., 0., 1.);
    vec4 emission;
    vec4 ambient;
    vec4 specular;
    ambient = u_ambient;
    diffuse = texture2D(u_diffuse, v_texcoord0);
    emission = u_emission;
    specular = u_specular;
    diffuse.xyz *= max(dot(normal,vec3(0.,0.,1.)), 0.);
    color.xyz += diffuse.xyz;
    color.xyz += emission.xyz;
    color = vec4(color.rgb * diffuse.a, diffuse.a);
    
    // contour part
    float edgeDetector = dot(-v_position, v_normal) > 0.3 ? 1.0 : 0.0;
    
    
    //gl_FragColor = color;
    //gl_FragColor = vec4(color.rgb * edgeDetector, 1.0);
    gl_FragColor = edgeDetector > 0.5 ? color : vec4(1.0, 0.0, 0.0, 1.0);

    //gl_FragColor = vec4(edgeDetector, edgeDetector, edgeDetector, 1.0);
    //gl_FragColor = u_ambient;
    //gl_FragColor = vec4(1.0, 0.5, 0.5, 1.0);
}
