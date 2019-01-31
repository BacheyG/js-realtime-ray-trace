//uniform mat4 quadrics[32];
//uniform vec4 materials[16];

var Scene = function(gl) {
	this.vsQuad = new Shader(gl, gl.VERTEX_SHADER, "quad_vs.essl");
	this.fsTrace = new Shader(gl, gl.FRAGMENT_SHADER, "trace_fs.essl");
	this.program = new Program(gl, this.vsQuad, this.fsTrace);
	this.quadGeometry = new QuadGeometry(gl);

	this.timeAtLastFrame = new Date().getTime();

	this.camera = new PerspectiveCamera();
  
  	this.program.centers[0].set(0, 0.4, 0, 1.0);
	this.program.colors[0].set(1.0, 1.0, 1.0, 0.3);
	this.program.modes[0].set(5.0, 0.0, 0.0, 1);

  	this.program.centers[1].set(0, 1.33, 0, 3.0);
	this.program.colors[1].set(1.0, 1.0, 1.0, 1.0);
	this.program.modes[1].set(1.0, 2.0, 0.0, 1);
	
	this.program.centers[2].set(2, 1, -3, 2.0);
	this.program.colors[2].set(1.0, 1.0, 0.4, 0.8);
	this.program.modes[2].set(1.0, 1.0, 0.0, 1);
	
	this.program.centers[3].set(2, 1, 3, 2.0);
	this.program.colors[3].set(1.0, 0.1, 0.1, 1);
	this.program.modes[3].set(1.0, 1.0, 0.0, 1);
	
	this.program.centers[4].set(-3, 1, 5, 2.0);
	this.program.colors[4].set(0.6, 1.0, 0.8, 1.0);
	this.program.modes[4].set(1.0, 2.0, 0.0, 1);
	
	this.program.centers[5].set(-3, 1, -5, 2.0);
	this.program.colors[5].set(0.2, 0.4, 1.0, 0.7);
	this.program.modes[5].set(1.0, 1.0, 0.0, 1);
	
	
	this.program.ambientLight.set(0.2, 0.3, 0.3, 1);

	this.program.passWeights[0].set(0.75);
	this.program.passWeights[1].set(0.25);
	
	this.program.lightPos[0].set(-3.0, 4.0, 5.0, 0.7);
	this.program.lightColor[0].set(0.2, 1.0, 0.8, 3.9);
	
	this.program.lightPos[1].set(3.0, 8.0, -5.0, 0.7);
	this.program.lightColor[1].set(0.5, 0.3, 0.2, 1.6);
	
	this.background = new TextureCube(gl, [
	"skybox/right.jpg",
	"skybox/left.jpg",
	"skybox/top.jpg",
	"skybox/bottom.jpg",
	"skybox/front.jpg",
	"skybox/back.jpg",]);
};

Scene.prototype.update = function(gl, keysPressed) {
  //jshint bitwise:false
  //jshint unused:false
  var timeAtThisFrame = new Date().getTime();
  var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;
  this.program.lightPos[0].set(-3.0, 4.0, 5.0 + Math.sin(new Date().getTime() / 1000.0) * 20.0, 0.2);
  this.program.lightPos[1].set(3.0 + Math.sin(new Date().getTime() / 520.0) * 20.0, 8.0, -5.0, 0.7);

  this.camera.move(dt, keysPressed);
 
  // clear the screen
  gl.clearColor(0.6, 0.0, 0.3, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  this.program.rayDirMatrix.set(this.camera.rayDirMatrix);
  this.program.eye.set(this.camera.position);
  this.program.background.set(this.background);

  this.program.commit();
  this.quadGeometry.draw();
};


