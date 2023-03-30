// constants
uniform mat4 u_worldViewProjection;

// inputs
attribute vec4 a_position;

// outputs
varying vec3 v_position;

void main() {

	// Copy local vertex position into an output
	// to be interpolated for the fragment shader
	v_position = a_position.xyz;

	// Transform local position into final vertex
	// screen position for the rasterizer hardware
	gl_Position = (u_worldViewProjection * a_position);
}