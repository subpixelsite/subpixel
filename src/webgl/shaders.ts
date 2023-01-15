// Compiled shader contents
// Copyright 2023 Christopher Lambert

export const shaders = new Map();

// ---------------- col.fs
shaders.set( 'col.fs', `
// ----------------
// col.fs

precision mediump float;

varying vec4 v_position;

void main() {

	gl_FragColor = vec4(v_position.xyz, 1.0);
}

// ----------------
` );

// ---------------- pos.vs
shaders.set( 'pos.vs', `
// ----------------
// pos.vs

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

// ----------------
` );
