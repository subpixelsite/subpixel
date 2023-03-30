precision mediump float;

// constants
uniform vec4 u_tint;

// inputs
varying vec3 v_position;

void main() {

	// Use interpolated position as the color with an opaque alpha value
	vec4 color = vec4(v_position, 1.0);

	// Apply tint and output final pixel color
	gl_FragColor = color * u_tint;
}