module.exports = (function(){
  return function GL(width, height){
    if (typeof window === "undefined"){
      var gl = require("./../Data/GL/GL.js")(width, height);
    } else {
      var canvas = document.createElement("canvas");
      var gl = canvas.getContext("webgl", {antialias: false});
      canvas.width = width;
      canvas.height = height;
      gl.canvas.style = [
        "border: 1px solid black;",
        "image-rendering: optimizeSpeed;",
        "image-rendering: -moz-crisp-edges;",
        "image-rendering: -webkit-optimize-contrast;",
        "image-rendering: -o-crisp-edges;",
        "image-rendering: pixelated;",
        "-ms-interpolation-mode: nearest-neighbor;"].join("");
    }

    // *{GL}, String, String -> ()
    gl.buildShader = function(vertexSrc, fragmentSrc){
      function compile(type, shaderSource){
        var shader = gl.createShader(type);
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);
        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
          throw "Error compiling shader" + gl.getShaderInfoLog(shader);
          gl.deleteShader(shader);
          return null;
        }
        return shader;
      }
      var vertexShader = compile(gl.VERTEX_SHADER, vertexSrc);
      var fragmentShader = compile(gl.FRAGMENT_SHADER, fragmentSrc);

      var shader = gl.createProgram();
      gl.attachShader(shader, vertexShader);
      gl.attachShader(shader, fragmentShader);
      gl.linkProgram(shader);
      if(!gl.getProgramParameter(shader, gl.LINK_STATUS))
        throw "Error linking shaders.";

      return shader;
    }

    // *{GL}, GLBuffer, Array, GLDrawMode -> GL
    gl.setBufferData = function(buffer, data, drawMode){
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), drawMode || gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      return gl;
    };

    // *{GL}, Uint, Uint -> TextureID
    gl.createUnaliasedTexture = function(width, height){
      var tx = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tx);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return tx;
    };

    // *{GL}, Number, Number, Uint8Array, TextureID -> GL 
    gl.setTextureData = function(width, height, data, tx){
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE0, tx);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
      return gl;
    };

    return gl;
  };
})();
