// constants
uniform mat4 u_worldViewProjection;

// inputs
attribute vec4 a_position;
attribute vec2 a_texcoord;

// outputs
varying vec4 v_position;
varying vec2 v_texcoord;

void main() {

	// Copy local vertex position and texture coordinates into 
	// outputs to be interpolated for the fragment shader
	v_position = a_position;
	v_texcoord = a_texcoord;

	// Transform local position into final vertex
	// screen position for the rasterizer hardware
	gl_Position = (u_worldViewProjection * a_position);
}