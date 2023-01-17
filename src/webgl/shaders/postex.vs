uniform mat4 u_worldViewProjection;

attribute vec4 a_position;
attribute vec2 a_texcoord;

varying vec4 v_position;
varying vec2 v_texcoord;

void main() {

	v_position = a_position;
	v_texcoord = a_texcoord;
	gl_Position = (u_worldViewProjection * a_position);
}