in vec4 Color;
in vec3 vPosition;
in float depth;

in vec3 modelVec;
in vec3 modelNormalVec;

uniform sampler3D Noise3;

uniform float uAd;
uniform float uBd;

uniform float uNoiseAmp;
uniform float uNoiseFreq;

uniform float uAlpha;

uniform float uTol;

uniform bool uUseLighting;

uniform bool uUseChromaDepth;
uniform float uChromaRed;
uniform float uChromaBlue;

const vec3 lightPos = vec3( -3.0, 0.0, 3.0 );
const vec3 ambientColor = vec3( 0.0, 0.0, 0.0 );
const vec3 specularColor = vec3( 0.4, 0.4, 0.4 );
const float specularShininess = 1000.0;

vec3 Rainbow( float t )
{
	t = clamp( t, 0., 1. );

	float r = 1.;
	float g = 0.0;
	float b = 1.  -  6. * ( t - (5./6.) );

	if( t <= (5./6.) )
	{
			r = 6. * ( t - (4./6.) );
			g = 0.;
			b = 1.;
	}

	if( t <= (4./6.) )
	{
			r = 0.;
			g = 1.  -  6. * ( t - (3./6.) );
			b = 1.;
	}

	if( t <= (3./6.) )
	{
			r = 0.;
			g = 1.;
			b = 6. * ( t - (2./6.) );
	}

	if( t <= (2./6.) )
	{
			r = 1.  -  6. * ( t - (1./6.) );
			g = 1.;
			b = 0.;
	}

	if( t <= (1./6.) )
	{
			r = 1.;
			g = 6. * t;
	}

	return vec3( r, g, b );
}

void main( void )
{
	vec4 nv = texture3D(Noise3, vPosition * uNoiseFreq);
	float sum = nv[0] + nv[1] + nv[2] + nv[3];
	float noise = ((sum - 1.0) / 2.0) - 0.5;
	noise *= uNoiseAmp;
	
	float up = 2 * gl_TexCoord[0].s;
	float vp = gl_TexCoord[0].t;
	
	float numinu = floor(up / uAd);
	float numinv = floor(vp / uBd);

	float uc = numinu * uAd + uAd / 2.0;
	float vc = numinv * uBd + uBd / 2.0;
	
	float du = up - uc;
	float dv = vp - vc;
	
	float oldrad = sqrt( du*du + dv*dv );
	float newrad = oldrad + noise;
	float ratio = newrad / oldrad;
	
	du *= ratio;
	dv *= ratio;
	
	float d = (du * 2.0 / uAd) * (du * 2.0 / uAd) + (dv * 2.0 / uBd) * (dv * 2.0 / uBd);
	float step = smoothstep( 0.0, uTol, 1.0 - d );
	
	vec4 ellipseColor = vec4( 1.0, 0.5, 0.0, 1.0 );
	if ( uUseChromaDepth ) {
		float t = (2.0 / 3.0) * (depth - uChromaRed) / (uChromaBlue - uChromaRed);
		t = clamp( t, 0.0, 2.0 / 3.0 );
		ellipseColor.xyz = Rainbow(t);
	}
	
	gl_FragColor = mix( Color, ellipseColor, step );
	
	if ( step < 1.0 ) {
		if ( uAlpha == 0.0 ) {
			discard;
		} else {
			gl_FragColor.a = uAlpha;
		}
	}
	
	if ( uUseLighting && !uUseChromaDepth ) {
		vec3 L = normalize( lightPos - modelVec );
		vec3 E = normalize(-modelVec);
		vec3 R = normalize(-reflect(L,modelNormalVec));
		
		vec3 diffuse = gl_FragColor.xyz * max(dot(modelNormalVec,L), 0.0);
		diffuse = clamp( diffuse, 0.0, 1.0 );
		
		vec3 specular = specularColor * pow(max(dot(R,E), 0.0), specularShininess);
		specular = clamp( specular, 0.0, 1.0 );
		
		gl_FragColor.xyz = ambientColor + diffuse + specular;
		gl_FragColor.xyz = clamp( gl_FragColor.xyz, 0.0, 1.0 );
	}
}
