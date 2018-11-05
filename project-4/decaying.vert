uniform float uA;
uniform float uB;
uniform float uC;
uniform float uD;

out vec3 vPosition;
out vec3 vNormal;

out vec3 modelVec;

#define MATH_PI 3.1415926535897932384626433
#define MATH_E	2.7182818284590452353602875

void main( void )
{
	gl_TexCoord[0] = gl_MultiTexCoord0;
	
	float radius = gl_Vertex.x * gl_Vertex.x + gl_Vertex.y * gl_Vertex.y;
	gl_Vertex.z += uA * cos(2 * MATH_PI * uB * radius + uC) * pow(MATH_E, -(uD * radius));
	
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
	vPosition = gl_Vertex;
	
	float drdx = 2.0 * gl_Position.x;
	float dzdx = -uA * sin(2.0 * MATH_PI * uB * radius + uC) * 2.0 * MATH_PI * uB * drdx * exp(-uD * radius) + uA * cos(2.0 * MATH_PI * uB * radius + uC) * exp(-uD * radius) * -uD * drdx;
	
	float drdy = 2.0 * gl_Position.y;
	float dzdy = -uA * sin(2.0 * MATH_PI * uB * radius + uC) * 2.0 * MATH_PI * uB * drdy * exp(-uD * radius) + uA * cos(2.0 * MATH_PI * uB * radius + uC) * exp(-uD * radius) * -uD * drdy;
	
	vec3 Tx = vec3( 1.0, 0.0, dzdx );
	vec3 Ty = vec3( 0.0, 1.0, dzdy );
	
	gl_Normal = normalize( cross(Tx, Ty) );
	vNormal = gl_Normal;
	
	modelVec = vec3(gl_ModelViewMatrix * gl_Vertex);
}