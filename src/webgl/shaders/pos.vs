uniform mat4 u_worldViewProjection;
// uniform mat4 u_world;
// uniform mat4 u_viewInverse;
// uniform mat4 u_worldInverseTranspose;

attribute vec4 a_position;

varying vec4 v_position;

void main() {

	v_position = a_position;
	gl_Position = (u_worldViewProjection * a_position);
}