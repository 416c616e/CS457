uniform sampler2D uImageUnit;

uniform float uScenter;
uniform float uTcenter;
uniform float uDs;
uniform float uDt;

uniform bool uCircle;
uniform float uCircleDiam;

uniform float uMagFactor;

uniform float uRotAngle;

uniform float uSharpFactor;
uniform float uResS;
uniform float uResT;

vec2 rotate_point( vec2 pivot, vec2 pos, float theta )
{
	vec2 output = vec2( pos.s - pivot.s, pos.t - pivot.t );
	
	float s = sin(theta);
	float c = cos(theta);
	
	float rotx = output.s * c - output.t * s;
	float roty = output.s * s + output.t * c;
	
	output.s = output.s + pivot.s + rotx;
	output.t = output.t + pivot.t + roty;
	
	return output;
}

vec3 sharpen( vec2 st, vec3 irgb, float ResS, float ResT, sampler2D ImageUnit, float T )
{
	vec2 stp0 = vec2(1./ResS,  0. );
	vec2 st0p = vec2(0.     ,  1./ResT);
	vec2 stpp = vec2(1./ResS,  1./ResT);
	vec2 stpm = vec2(1./ResS, -1./ResT);
	vec3 i00 =   texture2D( ImageUnit, st ).rgb;
	vec3 im1m1 = texture2D( ImageUnit, st-stpp ).rgb;
	vec3 ip1p1 = texture2D( ImageUnit, st+stpp ).rgb;
	vec3 im1p1 = texture2D( ImageUnit, st-stpm ).rgb;
	vec3 ip1m1 = texture2D( ImageUnit, st+stpm ).rgb;
	vec3 im10 =  texture2D( ImageUnit, st-stp0 ).rgb;
	vec3 ip10 =  texture2D( ImageUnit, st+stp0 ).rgb;
	vec3 i0m1 =  texture2D( ImageUnit, st-st0p ).rgb;
	vec3 i0p1 =  texture2D( ImageUnit, st+st0p ).rgb;
	vec3 target = vec3(0.,0.,0.);
	target += 1.*(im1m1+ip1m1+ip1p1+im1p1);
	target += 2.*(im10+ip10+i0m1+i0p1);
	target += 4.*(i00);
	target /= 16.;
	return vec4( mix( target, irgb, T ), 1. ).rgb;
}

void main( void )
{
	vec2 st = gl_TexCoord[0].st;
	vec3 tex = texture2D( uImageUnit, st ).rgb;
	
	if ( uCircle ) {
		float dist = (st.s - uScenter) * (st.s - uScenter) + (st.t - uTcenter) * (st.t - uTcenter);
		dist = sqrt(dist);
		
		if ( dist <= uCircleDiam ) {
			vec2 magst = vec2( st.s, st.t );
					
			magst.s = magst.s + ((uScenter - magst.s) * uMagFactor);
			magst.t = magst.t + ((uTcenter - magst.t) * uMagFactor);
			
			vec2 rotst = rotate_point( vec2(uScenter, uTcenter), magst, uRotAngle );
			
			tex = texture2D( uImageUnit, rotst ).rgb;
			tex = sharpen( rotst, tex, uResS, uResT, uImageUnit, uSharpFactor );
		}
	} else {
		if ( st.s >= uScenter - uDs && st.s <= uScenter + uDs ) {
			if ( st.t >= uTcenter - uDt && st.t <= uTcenter + uDt ) {
				vec2 magst = vec2( st.s, st.t );
				
				magst.s = magst.s + ((uScenter - magst.s) * uMagFactor);
				magst.t = magst.t + ((uTcenter - magst.t) * uMagFactor);
				
				vec2 rotst = rotate_point( vec2(uScenter, uTcenter), magst, uRotAngle );
				
				tex = texture2D( uImageUnit, rotst ).rgb;
				tex = sharpen( rotst, tex, uResS, uResT, uImageUnit, uSharpFactor );
			}
		}
	}

	gl_FragColor.rgb = tex;
	gl_FragColor.a = 1.0;
}