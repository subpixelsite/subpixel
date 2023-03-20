// Compiled shader contents
// Copyright 2023 Christopher Lambert

export const shaders = new Map();

// ---------------- col.fs
shaders.set( 'col.fs', `
// --- col.fs

precision mediump float;

varying vec4 v_position;

uniform vec4 u_color;

void main() {

	vec4 color = vec4(v_position.xyz, 1.0);
	gl_FragColor = color * u_color;
}
` );

// ---------------- pos.vs
shaders.set( 'pos.vs', `
// --- pos.vs

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
` );

// ---------------- postex.vs
shaders.set( 'postex.vs', `
// --- postex.vs

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
` );

// ---------------- tex.fs
shaders.set( 'tex.fs', `
// --- tex.fs

precision mediump float;

varying vec4 v_position;
varying vec2 v_texcoord;

uniform sampler2D u_diffuse;
uniform vec4 u_color;

void main() {

	vec4 color = texture2D(u_diffuse, v_texcoord);
	color *= u_color;

	gl_FragColor = color;
}
` );
