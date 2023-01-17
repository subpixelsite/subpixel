precision mediump float;

varying vec4 v_position;
varying vec2 v_texcoord;

uniform sampler2D u_diffuse;

void main() {

	vec4 color = texture2D(u_diffuse, v_texcoord);

	gl_FragColor = color;
}