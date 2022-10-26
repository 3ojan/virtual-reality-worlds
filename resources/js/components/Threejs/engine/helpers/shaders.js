export const fragment_tiny_world = `  

float PI = 3.1415926535;

uniform sampler2D texture;
uniform sampler2D texture2;
uniform float iTime;
varying vec2 vUv;

vec u_resolution = vec2 (1.0,1.0) ;

void main()
{
  // Normalized pixel coordinates (from 0 to 1)
  // vec2 uv = fragCoord/iResolution.xy;
    vec2 uv = vUv.xy;
   	vec2 mouseUv = iMouse.xy/iResolution.xy; 
   
    vec2 uv2 = (fragCoord - iResolution.xy/2.0)/iResolution.y;

    float u = atan(uv2.y, uv2.x);
    u = mod(u + 2.0 * mouseUv.x + 2.0 * PI, 2.0 * PI) / (2.0 * PI);
    float v = length(uv2);
    v = clamp(pow(v, 0.5 + 0.5 * mouseUv.y), 0.0, 1.0);
    
    vec2 uv3 = vec2(u * 2.0 * PI, v * PI - PI/2.0);
    vec3 rayDirection = vec3(cos(uv3.y) * cos(uv3.x), sin(uv3.y), cos(uv3.y) * sin(uv3.x));
    vec3 col = texture(texture, rayDirection).xyz;

    // Output to screen
    fragColor = vec4(col,1.0);
}

void main(  )
{
    //Strength of the falloff in the corners
    float FALLOFF =  fallOff ;
    //UV coordinates [1,2]
    vec2 originalUv =  vUv.xy / u_resolution.xy;
	vec2 uv = vUv.xy / u_resolution.xy;
	uv.xy += 1.0;
	vec2 grid;

	//Estimate hex coordinate
	grid.y = floor(uv.y / (1.5*R));
	float odd = mod(grid.y, 2.0);
	grid.x = floor(uv.x / (SQRT3 * R) - odd*.5);

	//Find possible centers of hexagons
	vec2 h1 = hexCenter(grid, odd);
	vec2 h2 = hexCenter(grid + vec2(1.0,0.0), odd);
	vec2 h3 = hexCenter(grid + vec2(odd, 1.0), 1.0-odd);

	//Find closest center
	float d1 = dot(h1-uv, h1-uv);
	float d2 = dot(h2-uv, h2-uv);
	float d3 = dot(h3-uv, h3-uv);
    
	if (d2 < d1)
	{
		d1 = d2;
		h1 = h2;
	}
	if (d3 < d1)
	{
		d1 = d3;
		h1 = h3;
	}
	
    //Hexagon UV
	vec2 uv2 = uv - h1;
    
    //Set Hexagon offset
	uv = (uv.xy - 1.0) + uv2 * OFFSET/(progress)/10.;

    //Per Facet Fisheye effect (optional)
	vec2 coords = (uv2 - 0.5*R) * 2.0;
	vec2 fisheye;
	fisheye.x = (1.0 - coords.y * coords.y) * FISH * (coords.x);
	fisheye.y = (1.0 - coords.x * coords.x) * FISH * (coords.y);
	uv -= fisheye*R;


    //Retrieve texture colour
    vec4 hexaColor = vec4(texture2D( texture, uv ).rgb, progress);  
    
    //hexed texture
    gl_FragColor = texture2D( texture, uv);

    vec3 c;
    vec4 Ca = texture2D(texture, vUv);
    vec4 Cb = texture2D(texture2, vUv);
    //multiple one gradient with original
    c = hexaColor.rgb * hexaColor.a + Cb.rgb * Cb.a * ( 1. - hexaColor.a);  // blending equation
    //gl_FragColor= vec4(c, 1.0);

    vec4 o = texture2D( texture, uv);
    //Redude corners (optional)
	gl_FragColor = max(vec4(0.0), o - length(2.0*uv-1.0)*FALLOFF);
}`

export const vertex_shader =
  `varying vec2 vUv;  
  void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
      `