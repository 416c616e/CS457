out vec4 Color;
out vec3 vPosition;
out float depth;

out vec3 modelVec;
out vec3 modelNormalVec;

void main( void )
{
	Color = gl_Color;
	gl_TexCoord[0] = gl_MultiTexCoord0;
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
	vPosition = gl_Vertex.xyz;
	
	depth = (gl_ModelViewMatrix * gl_Vertex).z;
	
	modelVec = vec3(gl_ModelViewMatrix * gl_Vertex);
	modelNormalVec = normalize(gl_NormalMatrix * gl_Normal);
}
