precision mediump float;

// constants
uniform sampler2D u_diffuse;
uniform vec4 u_tint;

// inputs
varying vec2 v_texcoord;

void main() {

	// Sample texture using input texture coords
	vec4 color = texture2D(u_diffuse, v_texcoord);

	// Apply tint
	color *= u_tint;

	// Ouptut final pixel color
	gl_FragColor = color;
}