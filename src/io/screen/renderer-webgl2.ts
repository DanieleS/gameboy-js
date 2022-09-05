import { Color } from "../../emulator/ppu/palette";

const vertexShaderSource = `#version 300 es

in vec2 a_position;

out vec2 v_texCoord;

void main() {
    gl_Position = vec4(a_position, 0, 1);

    v_texCoord = (vec2(1.0, -1.0) * gl_Position.xy * 0.5 + 0.5);
}
`;

const fragmentShaderSource = `#version 300 es

precision highp float;

uniform sampler2D u_image;

in vec2 v_texCoord;

out vec4 outColor;

void main() {
    outColor = texture(u_image, v_texCoord);
}
`;

const palette = [
  [0x75, 0x85, 0x34],
  [0x4e, 0x59, 0x23],
  [0x27, 0x2c, 0x11],
  [0x00, 0x00, 0x00],
];

function createImage(color: Color[]) {
  const buffer = new Uint8ClampedArray(color.length * 3);
  for (let i = 0; i < color.length; i++) {
    const colorIndex = color[i];
    const bufferIndex = i * 3;
    buffer[bufferIndex] = palette[colorIndex][0];
    buffer[bufferIndex + 1] = palette[colorIndex][1];
    buffer[bufferIndex + 2] = palette[colorIndex][2];
  }

  return buffer;
}

function createShader(
  gl: WebGL2RenderingContext,
  type: number,
  shaderSource: string
) {
  const shader = gl.createShader(type)!;

  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);

  throw new Error("Cannot create shader");
}

function createProgram(
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) {
  const program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);

  throw new Error("Cannot create program");
}

export function setupWebgl2Renderer(gl: WebGL2RenderingContext) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  const program = createProgram(gl, vertexShader, fragmentShader);
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  const imageLocation = gl.getUniformLocation(program, "u_image");

  const texture = gl.createTexture();

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  gl.enableVertexAttribArray(positionAttributeLocation);

  const size = 2;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  return function renderFrameWebgl(buffer: Color[]) {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.activeTexture(gl.TEXTURE0);

    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const mipLevel = 0;
    const internalFormat = gl.RGB;
    const srcFormat = gl.RGB;
    const srcType = gl.UNSIGNED_BYTE;
    gl.texImage2D(
      gl.TEXTURE_2D,
      mipLevel,
      internalFormat,
      160,
      144,
      0,
      srcFormat,
      srcType,
      createImage(buffer)
    );

    gl.uniform1i(imageLocation, 0);

    gl.bindVertexArray(vao);

    const primitiveType = gl.TRIANGLES;
    const count = 6;

    gl.drawArrays(primitiveType, offset, count);
  };
}
