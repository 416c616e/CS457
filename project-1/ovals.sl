surface
ovals( float
			Ad = 0.0025, // dot radius A
			Bd = 0.10, // dot radius B
			Ks = 0.5,
			Kd = 0.5,
			Ka = .1,
			roughness = 0.1;
	color	specularColor = color( 1, 1, 1 )
)
{
	float up = 2. * u;
	float vp = v;
	float numinu = floor( up / (2. * Ad) );
	float numinv = floor( vp / (2. * Bd) );
	
	color dotColor = Cs;
	if( mod( numinu+numinv, 2 ) == 0 )
	{
		float uc = numinu * 2. * Ad + Ad;
		float vc = numinv * 2. * Bd + Bd;
		up = up - uc;
		vp = vp - vc;
		float distA = (0. - up) / Ad;
		float distB = (0. - vp) / Bd;
		distA = distA * distA;
		distB = distB * distB;
		if( distA + distB <= 1 )
		{
			dotColor = color( 1., .5, 0. ); // beaver orange?
		}
	}
	varying vector Nf = faceforward( normalize( N ), I );
	vector V = normalize( -I );
	Oi = 1.;
	Ci = Oi * ( dotColor * ( Ka * ambient() + Kd * diffuse(Nf) ) +
				specularColor * Ks * specular( Nf, V, roughness ) );
}