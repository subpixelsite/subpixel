// Compiled shader contents
// Copyright 2023 Christopher Lambert

export const shaders = new Map();

// ---------------- col.fs
shaders.set(
  'col.fs',
  `
// ----------------
// col.fs

precision mediump float;

// uniform float time;

void main() {
	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}

// ----------------
`
);

// ---------------- pos.vs
shaders.set(
  'pos.vs',
  `
// ----------------
// pos.vs

attribute vec4 a_position;

void main() {
	gl_Position = a_position;
}

// ----------------
`
);
