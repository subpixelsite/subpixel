precision mediump float;

varying vec4 v_position;

uniform vec4 u_color;

void main() {

	vec4 color = vec4(v_position.xyz, 1.0);
	gl_FragColor = color * u_color;
}