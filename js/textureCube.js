var TextureCube = function(gl, mediaFileUrls) {
  gl.pendingResources[mediaFileUrls[0]] = ++gl.pendingResources[mediaFileUrls[0]] || 1;
  this.mediaFileUrls = mediaFileUrls;
  this.glTexture = gl.createTexture();
  this.loadedCount = 0;
  this.images = []
  var theTexture = this;
  for(var i=0; i<6; i++){
    this.images[i] = new Image();
    this.images[i].onload = function() { theTexture.loaded(gl); }
    this.images[i].src = mediaFileUrls[i];
  }
};

TextureCube.prototype.loaded = function(gl){
  this.loadedCount++;
  if(this.loadedCount < 6)
    return;
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.glTexture);
  for(var i=0; i<6; i++){
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X+i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.images[i]);
  }
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
  if( --gl.pendingResources[this.mediaFileUrls[0]] === 0 ) {
    delete gl.pendingResources[this.mediaFileUrls[0]];
  }
};

TextureCube.prototype.commit = function(gl, uniformLocation, textureUnit){
  gl.uniform1i(uniformLocation, textureUnit);
  gl.activeTexture(gl.TEXTURE0 + textureUnit);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.glTexture);
};

