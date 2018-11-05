uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform sampler3D Noise3;

uniform float uKa;
uniform float uKd;
uniform float uKs;
uniform float uShininess;
uniform float uLightX;
uniform float uLightY;
uniform float uLightZ;
uniform vec4 uMaterialColor;
uniform vec4 uLightColor;
uniform vec4 uSpecularColor;

in vec3 vPosition;
in vec3 vNormal;

in vec3 modelVec;

vec3 RotateNormal( float angx, float angy, vec3 n )
{
	float cx = cos( angx );
	float sx = sin( angx );
	float cy = cos( angy );
	float sy = sin( angy );

	// rotate about x:
	float yp =  n.y*cx - n.z*sx;    // y'
	n.z      =  n.y*sx + n.z*cx;    // z'
	n.y      =  yp;
	// n.x      =  n.x;

	// rotate about y:
	float xp =  n.x*cy + n.z*sy;    // x'
	n.z      = -n.x*sy + n.z*cy;    // z'
	n.x      =  xp;
	// n.y      =  n.y;

	return normalize( n );
}

void main( void )
{
	vec4 nvx = texture3D(Noise3, vPosition * uNoiseFreq);
	vPosition.z += 0.5;
	vec4 nvy = texture3D(Noise3, vPosition * uNoiseFreq);
	float angx = (nvx[0] + nvx[1] + nvx[2] + nvx[3] - 2.0) * uNoiseAmp;
	float angy = (nvy[0] + nvy[1] + nvy[2] + nvy[3] - 2.0) * uNoiseAmp;
	
	vNormal = RotateNormal( angx, angy, vNormal );
	
	vec3 lightPos = vec3(uLightX, uLightY, uLightZ);
	vec4 Color = uLightColor * uMaterialColor;

	vec3 L = normalize( lightPos - modelVec );
	vec3 E = normalize(-modelVec);
	vec3 R = normalize( reflect( -lightPos, vNormal ) );
	
	vec3 ambient = Color.rgb;
	vec3 diffuse = max( dot(L, vNormal), 0.0 ) * Color.rgb;
	vec3 spec = uSpecularColor * pow( max(dot(R,E), 0.0), uShininess );
	
	gl_FragColor.rgb = uKa * ambient + uKd * diffuse + uKs * spec;
	gl_FragColor.a = 1.0;
}