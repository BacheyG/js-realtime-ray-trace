var Program = function(gl, vertexShader, fragmentShader) {
  this.gl = gl;
  this.sourceFileNames = {vs:vertexShader.sourceFileName, fs:fragmentShader.sourceFileName};
  this.glProgram = gl.createProgram();
  gl.attachShader(this.glProgram, vertexShader.glShader);
  gl.attachShader(this.glProgram, fragmentShader.glShader);

  gl.bindAttribLocation(this.glProgram, 0, 'vertexPosition');
  gl.bindAttribLocation(this.glProgram, 1, 'vertexNormal');  
  gl.bindAttribLocation(this.glProgram, 2, 'vertexTexCoord');  

  gl.linkProgram(this.glProgram);
  if (!gl.getProgramParameter(this.glProgram, gl.LINK_STATUS)) {
    throw new Error('Could not link shaders [vertex shader:' + vertexShader.sourceFileName + ']:[fragment shader: ' + fragmentShader.sourceFileName + ']\n' + gl.getProgramInfoLog(this.glProgram));
  }

  var textureUnitCount=0;
  this.uniformLocations = {};
  var nUniforms = gl.getProgramParameter(this.glProgram, gl.ACTIVE_UNIFORMS);
  for(var i=0; i<nUniforms; i++){
    var glUniform = gl.getActiveUniform(this.glProgram, i);
    var uniformName = glUniform.name.split('[')[0];
    this.uniformLocations[uniformName] = gl.getUniformLocation(this.glProgram, glUniform.name);
    var reflectionVariable =
        UniformReflectionFactories.makeVar(gl, glUniform.type, glUniform.size, textureUnitCount);
    Object.defineProperty(this, uniformName, {value: reflectionVariable} );
    if(glUniform.type === gl.SAMPLER_2D || glUniform.type === gl.SAMPLER_CUBE){ 
      textureUnitCount += glUniform.arraySize; 
    } 
  }
};

Program.prototype.commit = function(){
	this.gl.useProgram(this.glProgram);
  var theProgram = this;
  Object.keys(theProgram.uniformLocations).forEach( function(uniformName) {
    theProgram[uniformName].commit( theProgram.gl, theProgram.uniformLocations[uniformName]);
  });  
};

