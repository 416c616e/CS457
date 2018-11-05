#version 400 compatibility
#extension GL_EXT_gpu_shader4: enable
#extension GL_EXT_geometry_shader4: enable

layout( triangles ) in;
layout( triangle_strip, max_vertices=32 ) out;

uniform float uShrink;
uniform float uLightX, uLightY, uLightZ;

in vec3 teECposition[3];
in vec3 teNormal[3];

out vec3 gNs;
out vec3 gLs;
out vec3 gEs;

vec3 LightPos = vec3( uLightX, uLightY, uLightZ );
vec3 V[3];
vec3 CG;

void ProduceVertex( int v )
{
	gNs = teNormal[v];
	gLs = LightPos - teECposition[v];
	gEs = vec3(0.,0.,0.) - teECposition[v];
	gl_Position = gl_ProjectionMatrix * vec4( CG + uShrink * ( V[v] - CG ), 1. );
	EmitVertex();
}

void main()
{
	V[0] = gl_PositionIn[0].xyz;
	V[1] = gl_PositionIn[1].xyz;
	V[2] = gl_PositionIn[2].xyz;
	
	CG = ( V[0] + V[1] + V[2] ) / 3.;
	
	ProduceVertex( 0 );
	ProduceVertex( 1 );
	ProduceVertex( 2 );
}