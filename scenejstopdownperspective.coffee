###
Extensions to SceneJS for Gates of Olympus
Copyright 2010, Rehno Lindeque.

* This file is dual licensed under the MIT or GPL Version 2 licenses.
* It is intended to be compatible with http://scenejs.org/license so that changes can be back-ported.
###

###
A custom SceneJS transformation node that scales in the y-axis
###

TopDownPerspective = SceneJS.createNodeType("top-down-perspective")

TopDownPerspective.prototype._init = (params) ->
  this._mat = null
  this._xform = null
  this._factor = 1.0
  this.setFactor(params.factor)

TopDownPerspective.prototype.setFactor = (factor) ->
  if factor != undefined
    this._factor = factor
  this._setDirty()
  this

TopDownPerspective.prototype.getFactor = -> this._factor

###
* Returns a copy of the matrix as a 1D array of 16 elements
* @returns {Number[16]} The matrix elements
###

TopDownPerspective.prototype.getMatrix = ->
  if (this._memoLevel > 0) then this._mat.slice(0) else SceneJS._math_scalingMat4v([this._x, this._y, this._z])

TopDownPerspective.prototype._render = (traversalContext) ->
    origMemoLevel = this._memoLevel
    
    if this._memoLevel == 0
      this._memoLevel = 1
      this._mat = SceneJS._math_scalingMat4v([this._x, this._y, this._z])
    
    superXform = SceneJS._modelViewTransformModule.getTransform()
    if origMemoLevel < 2 || not superXform.fixed
      instancing = SceneJS._instancingModule.instancing()

      tempMat = SceneJS._math_mulMat4(superXform.matrix, this._mat)
      this._xform =
        localMatrix: this._mat,
        matrix: tempMat,
        fixed: origMemoLevel == 2

      # Bump up memoization level if model-space fixed
      if this._memoLevel == 1 && superXform.fixed && !instancing
        this._memoLevel = 2

    SceneJS._modelViewTransformModule.setTransform(this._xform)
    this._renderNodes(traversalContext)
    SceneJS._modelViewTransformModule.setTransform(superXform)
