precision mediump float;

// constants
uniform vec4 u_tint;

void main() {

	// Use tint constant as the color
	vec4 color = u_tint;

	// Output final pixel color
	gl_FragColor = color;
}