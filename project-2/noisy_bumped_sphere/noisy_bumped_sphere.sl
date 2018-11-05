displacement
noisy_bumped_sphere( float
                Ad = 0.100,              // u diameter
                Bd = 0.050,              // v diameter
                DispAmp = 0.10          // displacement amplitude
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
	
	if( d + factor <= 1.0 )
	{
		N = calculatenormal(P + ((1.0 - (d + factor)) * DispAmp * normalize(N)));
	} else {
		N = calculatenormal(P);
	}
}