#version 400 compatibility

in vec3 gNs;
in vec3 gLs;
in vec3 gEs;

uniform float uKa, uKd, uKs;
uniform float uShininess;

uniform vec4 uSurfaceColor;
uniform vec4 uSpecularColor;

void main()
{
	vec3 norm = normalize(gNs);
	vec3 light = normalize(gLs);
	vec3 eye = normalize(gEs);
	
	float dotprod = dot( norm, light );
	
	vec3 amb = uKa * uSurfaceColor.rgb;
	vec3 diff = uKd * uSurfaceColor.rgb;
	vec3 spec = uKs * uSpecularColor.rgb;
	
	if ( dotprod > 0.0 ) {
		spec *= pow( max(dot(eye,normalize(2.0 * norm * dot(norm, light) - light)), 0.0), uShininess );
	} else {
		spec = vec3(0.0, 0.0, 0.0);
	}
	
	gl_FragColor.rgb = amb + diff + spec;
	gl_FragColor.a = 1.0;
}