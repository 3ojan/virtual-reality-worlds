export const videoTextureShaderProps = {
  vertexShader:
    `
    varying vec2 vUv;     
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader:
    `
    varying vec2 vUv;
    uniform sampler2D tex;
    uniform float ratio;
    uniform bool isPortrait;
    
    void main() {
      vec2 uv = vUv;

      if(isPortrait){
        uv.y *= ratio;
        uv.y -= (0.5 - (1. / ratio) * 0.5) * ratio;
      }else{
        uv.x /= ratio;
        uv.x += (0.5 - (1. / ratio) * 0.5);
      }
              
      vec3 col = texture2D(tex, uv).rgb;
      col = mix(col, vec3(0), step(0.5, abs(uv.y - 0.5)));
      
      gl_FragColor = vec4(col, 1.);
    }
`
}



export const screenShareTextureShaderProps = {
  vertexShader:
    `
    varying vec2 vUv;   
      
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader:
    `
    varying vec2 vUv;
    uniform sampler2D tex;
    uniform float ratio;
    uniform bool isPortrait;

    void main() {
      vec2 uv = vUv;
      vec2 coords = vUv;

      if(isPortrait){
        uv.x /= ratio;
        uv.x += (0.5 - (1. / ratio) * 0.5);
      }else{
        uv.y *= ratio;
        uv.y -= (0.5 - (1. / ratio) * 0.5) * ratio;
      }
      vec3 col = texture2D(tex, uv).rgb;
      col = mix(col, vec3(0), step(0.5, abs(uv.y - 0.5)));

    
      if( step(0.5, abs(uv.y - 0.5)) > 0.0  ){ 
        gl_FragColor = vec4(col, 0.);
      }
      else if( step(0.5, abs(uv.x - 0.5)) > 0.0  ){ 
        gl_FragColor = vec4(col, 0.);
      }
      else{
        gl_FragColor = vec4(col, 1.);
      }
      
   
    }
  `
}

