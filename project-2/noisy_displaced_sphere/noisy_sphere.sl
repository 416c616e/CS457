surface
noisy_sphere( float
			Ad = 0.100, // dot radius A
			Bd = 0.050, // dot radius B
			Ks = 0.5,
			Kd = 0.5,
			Ka = .1,
			roughness = 0.1;
	color	specularColor = color( 1, 1, 1 )
)
{
	point PP = point "shader" P;
	float magnitude = 0.;
	float size = 1.0;
	float i;
	for( i = 0.; i < 6.0; i += 1.0 )
	{
		magnitude += (noise(size * PP) - 0.5) / size;
		size *= 2.0;
	}
	
	float Ar = Ad / 2.0;
	float Br = Bd / 2.0;
	
	float up = 2. * u;
	float vp = v;
	
	float numinu = floor( up / Ad );
	float numinv = floor( vp / Bd );

	float uc = numinu * Ad + Ar;
	float vc = numinv * Bd + Br;
	
	float du = up - uc;
	float dv = vp - vc;
	
	float factor = 4.0 * magnitude;
	
	float d = (((0.0 - du) / Ar) * ((0.0 - du) / Ar)) + (((0.0 - dv) / Br) * ((0.0 - dv) / Br));
	
	color dotColor = Cs;
	if( d + factor <= 1.0 )
	{
		dotColor = color( 1.0, 0.5, 0. );
	}

	varying vector Nf = faceforward( normalize( N ), I );
	vector V = normalize( -I );
	
	Oi = 1.;
	Ci = Oi * (dotColor * (Ka * ambient() + Kd * diffuse(Nf)) + specularColor * Ks * specular(Nf, V, roughness));
}