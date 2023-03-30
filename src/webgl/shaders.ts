// Compiled shader contents
// Copyright 2023 Christopher Lambert

export const shaders = new Map();

// ---------------- col.fs
shaders.set( 'col.fs', `
// --- col.fs

precision mediump float;

// constants
uniform vec4 u_tint;

void main() {

	// Use tint constant as the color
	vec4 color = u_tint;

	// Output final pixel color
	gl_FragColor = color;
}
` );

// ---------------- col_diff.fs
shaders.set( 'col_diff.fs', `
// --- col_diff.fs

precision mediump float;

// constants
uniform vec3 u_toLight;
uniform vec3 u_lightColor;
uniform vec3 u_ambientLight;
uniform vec4 u_tint;

// inputs
varying vec3 v_normal;

void main() {

	// Make sure the interpolated normal is unit length
	vec3 normal = normalize(v_normal);

	// Compute the Lambert term: N · L clamped so that anything past
	// the tangent line is not lit
	float diffuse = clamp(dot(normal, u_toLight), 0.0, 1.0);

	// Apply the diffuse calculation to the light color
	vec3 color = u_lightColor * diffuse;

	// Add an ambient lighting term to avoid pure black
	color += u_ambientLight;

	// Apply tint and output the final pixel color
	gl_FragColor = vec4(color * u_tint.rgb, u_tint.a);
}
` );

// ---------------- col_norm.fs
shaders.set( 'col_norm.fs', `
// --- col_norm.fs

precision mediump float;

// constants
uniform vec4 u_tint;

// inputs
varying vec3 v_normal;

void main() {

	// Use interpolated normal as the color with an opaque alpha value
	vec4 color = vec4(v_normal.rgb, 1.0);

	// Apply tint and output final pixel color
	gl_FragColor = color * u_tint;
}
` );

// ---------------- col_pos.fs
shaders.set( 'col_pos.fs', `
// --- col_pos.fs

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
` );

// ---------------- pos.vs
shaders.set( 'pos.vs', `
// --- pos.vs

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
` );

// ---------------- pos_norm.vs
shaders.set( 'pos_norm.vs', `
// --- pos_norm.vs

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
` );

// ---------------- pos_tex.vs
shaders.set( 'pos_tex.vs', `
// --- pos_tex.vs

// constants
uniform mat4 u_worldViewProjection;

// inputs
attribute vec4 a_position;
attribute vec2 a_texcoord;

// outputs
varying vec3 v_position;
varying vec2 v_texcoord;

void main() {

	// Copy local vertex position and texture coordinates into 
	// outputs to be interpolated for the fragment shader
	v_position = a_position.xyz;
	v_texcoord = a_texcoord;

	// Transform local position into final vertex
	// screen position for the rasterizer hardware
	gl_Position = (u_worldViewProjection * a_position);
}
` );

// ---------------- tex.fs
shaders.set( 'tex.fs', `
// --- tex.fs

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
` );
