// constants
uniform mat4 u_worldViewProjection;
uniform mat4 u_worldInverseTranspose;

// inputs
attribute vec4 a_position;
attribute vec3 a_normal;

// outputs
varying vec3 v_position;
varying vec3 v_normal;

void main() {

	// Transform local position into final vertex
	// screen position
	v_position = a_position.xyz;

	// Transform local normal into world space
	//   (adding 0 as the 4th component makes it
	//    transform the direction, but not the position)
	v_normal = (u_worldInverseTranspose * vec4(a_normal, 0)).xyz;

	// Output screen position for the rasterizer hardware
	gl_Position = (u_worldViewProjection * a_position);
}