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