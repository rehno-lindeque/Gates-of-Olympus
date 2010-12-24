/*
 * SceneJS math functions for use in Gates of Olympus.
 * Code was taken from core/math.js in the SceneJS library (http://scenejs.org/).
 * SceneJS version: 0.7.6.1
 *
 * Copyright 2010, Lindsay Kay
 * Changes copyright 2010, Rehno Lindeque.
 *
 * This file is Dual licensed under the MIT or GPL Version 2 licenses.
 * It is intended to be compatible with http://scenejs.org/license so that changes can be back-ported.
 */

divVec3 = function(u, v) {
  return [u[0] / v[0], u[1] / v[1], u[2] / v[2]];
}

negateVector4 = function(v) {
  return [-v[0],-v[1],-v[2],-v[3]];
}

addVec4 = function(u, v) {
  return [u[0] + v[0],u[1] + v[1],u[2] + v[2],u[3] + v[3]];
}

addVec3 = function(u, v) {
  return [u[0] + v[0],u[1] + v[1],u[2] + v[2]];
}

addVec4s = function(v, s) {
  return [v[0] + s,v[1] + s,v[2] + s,v[3] + s];
}

addScalarVec4 = function(s, v) {
  return addVec4s(v, s)
}

subVec4 = function(u, v) {
  return [u[0] - v[0],u[1] - v[1],u[2] - v[2],u[3] - v[3]];
}

subVec3 = function(u, v) {
  return [u[0] - v[0],u[1] - v[1],u[2] - v[2]];
}

subVec4Scalar = function(v, s) {
  return [v[0] - s,v[1] - s,v[2] - s,v[3] - s];
}

subScalarVec4 = function(v, s) {
  return [s - v[0],s - v[1],s - v[2],s - v[3]];
}

mulVec4 = function(u, v) {
  return [u[0] * v[0],u[1] * v[1],u[2] * v[2],u[3] * v[3]];
}

mulVec4Scalar = function(v, s) {
  return [v[0] * s,v[1] * s,v[2] * s,v[3] * s];
}

mulVec3Scalar = function(v, s) {
  return [v[0] * s, v[1] * s, v[2] * s];
}

divVec4 = function(u, v) {
  return [u[0] / v[0],u[1] / v[1],u[2] / v[2],u[3] / v[3]];
}

divScalarVec3 = function(s, v) {
  return [s / v[0], s / v[1], s / v[2]];
}

divVec3s = function(v, s) {
  return [v[0] / s, v[1] / s, v[2] / s];
}

divVec4s = function(v, s) {
  return [v[0] / s,v[1] / s,v[2] / s,v[3] / s];
}

divScalarVec4 = function(s, v) {
  return [s / v[0],s / v[1],s / v[2],s / v[3]];
}

dotVector4 = function(u, v) {
  return (u[0] * v[0] + u[1] * v[1] + u[2] * v[2] + u[3] * v[3]);
}

cross3Vec4 = function(u, v) {
  return [u[1] * v[2] - u[2] * v[1],u[2] * v[0] - u[0] * v[2],u[0] * v[1] - u[1] * v[0],0.0];
}

cross3Vec3 = function(u, v) {
  return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
}

sqLenVec4 = function(v) {
  return dotVector4(v, v);
}

lenVec4 = function(v) {
  return Math.sqrt(sqLenVec4(v));
}

dotVector3 = function(u, v) {
  return (u[0] * v[0] + u[1] * v[1] + u[2] * v[2]);
}

sqLenVec3 = function(v) {
  return dotVector3(v, v);
}

lenVec3 = function(v) {
  return Math.sqrt(sqLenVec3(v));
}

rcpVec3 = function(v) {
  return divScalarVec3(1.0, v);
}

normalizeVec4 = function(v) {
  var f = 1.0 / lenVec4(v);
  return mulVec4Scalar(v, f);
}

normalizeVec3 = function(v) {
  var f = 1.0 / lenVec3(v);
  return mulVec3Scalar(v, f);
}

mat4 = function() {
  return new Array(16);
}

mat3 = function() {
  return new Array(9);
}

dupMat4 = function(m) {
  return m.slice(0, 16);
}

getCellMat4 = function(m, row, col) {
  return m[row + col * 4];
}

setCellMat4 = function(m, row, col, s) {
  m[row + col * 4] = s;
}

getRowMat4 = function(m, r) {
  return [m[r + 0], m[r + 4], m[r + 8], m[r + 12]];
}

setRowMat4 = function(m, r, v) {
  m[r + 0] = v[0];
  m[r + 4] = v[1];
  m[r + 8] = v[2];
  m[r + 12] = v[3];
}

setRowMat4c = function(m, r, x, y, z, w) {
  setRowMat4(m, r, [x,y,z,w]);
}

setRowMat4s = function(m, r, s) {
  setRowMat4c(m, r, s, s, s, s);
}

getColMat4 = function(m, c) {
  var i = c * 4;
  return [m[i + 0], m[i + 1],m[i + 2],m[i + 3]];
}

setColMat4v = function(m, c, v) {
  var i = c * 4;
  m[i + 0] = v[0];
  m[i + 1] = v[1];
  m[i + 2] = v[2];
  m[i + 3] = v[3];
}

setColMat4c = function(m, c, x, y, z, w) {
  setColMat4v(m, c, [x,y,z,w]);
}

setColMat4Scalar = function(m, c, s) {
  setColMat4c(m, c, s, s, s, s);
}

mat4To3 = function(m) {
  return [
    m[0],m[1],m[2],
    m[4],m[5],m[6],
    m[8],m[9],m[10]
  ];
}

m4s = function(s) {
  return [
    s,s,s,s,
    s,s,s,s,
    s,s,s,s,
    s,s,s,s
  ];
}

setMat4ToZeroes = function() {
  return m4s(0.0);
}

setMat4ToOnes = function() {
  return m4s(1.0);
}

diagonalMat4v = function(v) {
  return [
    v[0], 0.0, 0.0, 0.0,
    0.0,v[1], 0.0, 0.0,
    0.0, 0.0, v[2],0.0,
    0.0, 0.0, 0.0, v[3]
  ];
}

diagonalMat4c = function(x, y, z, w) {
  return diagonalMat4v([x,y,z,w]);
}

diagonalMat4s = function(s) {
  return diagonalMat4c(s, s, s, s);
}

identityMat4 = function() {
  return diagonalMat4s(1.0);
}

isIdentityMat4 = function(m) {
  var i = 0;
  var j = 0;
  var s = 0.0;
  for (i = 0; i < 4; ++i) {
    for (j = 0; j < 4; ++j) {
      s = m[i + j * 4];
      if ((i == j)) {
        if (s != 1.0) {
          return false;
        }
      }
      else {
        if (s != 0.0) {
          return false;
        }
      }
    }
  }
  return true;
}

negateMat4 = function(m) {
  var r = mat4();
  for (var i = 0; i < 16; ++i) {
    r[i] = -m[i];
  }
  return r;
}

addMat4 = function(a, b) {
  var r = mat4();
  for (var i = 0; i < 16; ++i) {
    r[i] = a[i] + b[i];
  }
  return r;
}

addMat4Scalar = function(m, s) {
  var r = mat4();
  for (var i = 0; i < 16; ++i) {
    r[i] = m[i] + s;
  }
  return r;
}

addScalarMat4 = function(s, m) {
  return addMat4Scalar(m, s);
}

subMat4 = function(a, b) {
  var r = mat4();
  for (var i = 0; i < 16; ++i) {
    r[i] = a[i] - b[i];
  }
  return r;
}

subMat4Scalar = function(m, s) {
  var r = mat4();
  for (var i = 0; i < 16; ++i) {
    r[i] = m[i] - s;
  }
  return r;
}

subScalarMat4 = function(s, m) {
  var r = mat4();
  for (var i = 0; i < 16; ++i) {
    r[i] = s - m[i];
  }
  return r;
}

mulMat4 = function(a, b) {
  var r = mat4();
  var i = 0;
  var j = 0;
  var k = 0;
  var s = 0.0;
  for (i = 0; i < 4; ++i) {
    for (j = 0; j < 4; ++j) {
      s = 0.0;
      for (k = 0; k < 4; ++k) {
        s += a[i + k * 4] * b[k + j * 4];
      }
      r[i + j * 4] = s;
    }
  }
  return r;
}

mulMat4s = function(m, s)
{
  var r = mat4();
  for (var i = 0; i < 16; ++i) {
      r[i] = m[i] * s;
  }
  return r;
}

mulMat4v4 = function(m, v) {
  return [
    m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12] * v[3],
    m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13] * v[3],
    m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14] * v[3],
    m[3] * v[0] + m[7] * v[1] + m[11] * v[2] + m[15] * v[3]
  ];
}

mulMat3v3 = function(m, v) {
  return [
    m[0] * v[0] + m[3] * v[1] + m[6] * v[2],
    m[1] * v[0] + m[4] * v[1] + m[7] * v[2],
    m[2] * v[0] + m[5] * v[1] + m[8] * v[2]
  ];
}

transposeMat4 = function(m) {
  var r = mat4();
  var i = 0;
  var j = 0;
  for (i = 0; i < 4; ++i) {
    for (j = 0; j < 4; ++j) {
      r[i + j * 4] = m[i * 4 + j];
    }
  }
  return r;
}

transposeMat3 = function(m) {
  var r = mat3();
  var i = 0;
  var j = 0;
  for (i = 0; i < 3; ++i) {
    for (j = 0; j < 3; ++j) {
      r[i + j * 3] = m[i * 3 + j];
    }
  }
  return r;
}

determinantMat4 = function(m) {
  var f = getCellMat4;
  return (
    f(m, 0, 3) * f(m, 1, 2) * f(m, 2, 1) * f(m, 3, 0) - f(m, 0, 2) * f(m, 1, 3) * f(m, 2, 1) * f(m, 3, 0) - f(m, 0, 3) * f(m, 1, 1) * f(m, 2, 2) * f(m, 3, 0) + f(m, 0, 1) * f(m, 1, 3) * f(m, 2, 2) * f(m, 3, 0) +
    f(m, 0, 2) * f(m, 1, 1) * f(m, 2, 3) * f(m, 3, 0) - f(m, 0, 1) * f(m, 1, 2) * f(m, 2, 3) * f(m, 3, 0) - f(m, 0, 3) * f(m, 1, 2) * f(m, 2, 0) * f(m, 3, 1) + f(m, 0, 2) * f(m, 1, 3) * f(m, 2, 0) * f(m, 3, 1) +
    f(m, 0, 3) * f(m, 1, 0) * f(m, 2, 2) * f(m, 3, 1) - f(m, 0, 0) * f(m, 1, 3) * f(m, 2, 2) * f(m, 3, 1) - f(m, 0, 2) * f(m, 1, 0) * f(m, 2, 3) * f(m, 3, 1) + f(m, 0, 0) * f(m, 1, 2) * f(m, 2, 3) * f(m, 3, 1) +
    f(m, 0, 3) * f(m, 1, 1) * f(m, 2, 0) * f(m, 3, 2) - f(m, 0, 1) * f(m, 1, 3) * f(m, 2, 0) * f(m, 3, 2) - f(m, 0, 3) * f(m, 1, 0) * f(m, 2, 1) * f(m, 3, 2) + f(m, 0, 0) * f(m, 1, 3) * f(m, 2, 1) * f(m, 3, 2) +
    f(m, 0, 1) * f(m, 1, 0) * f(m, 2, 3) * f(m, 3, 2) - f(m, 0, 0) * f(m, 1, 1) * f(m, 2, 3) * f(m, 3, 2) - f(m, 0, 2) * f(m, 1, 1) * f(m, 2, 0) * f(m, 3, 3) + f(m, 0, 1) * f(m, 1, 2) * f(m, 2, 0) * f(m, 3, 3) +
    f(m, 0, 2) * f(m, 1, 0) * f(m, 2, 1) * f(m, 3, 3) - f(m, 0, 0) * f(m, 1, 2) * f(m, 2, 1) * f(m, 3, 3) - f(m, 0, 1) * f(m, 1, 0) * f(m, 2, 2) * f(m, 3, 3) + f(m, 0, 0) * f(m, 1, 1) * f(m, 2, 2) * f(m, 3, 3)
  );
}

inverseMat4 = function(m) {
  var m0 = m[ 0], m1 = m[ 1], m2 = m[ 2], m3 = m[ 3],
      m4 = m[ 4], m5 = m[ 5], m6 = m[ 6], m7 = m[ 7],
      m8 = m[ 8], m9 = m[ 9], m10 = m[10], m11 = m[11],
      m12 = m[12], m13 = m[13], m14 = m[14], m15 = m[15]  ;

  var n = identityMat4();

  n[ 0] = (m9 * m14 * m7 - m13 * m10 * m7 + m13 * m6 * m11 - m5 * m14 * m11 - m9 * m6 * m15 + m5 * m10 * m15);
  n[ 1] = (m13 * m10 * m3 - m9 * m14 * m3 - m13 * m2 * m11 + m1 * m14 * m11 + m9 * m2 * m15 - m1 * m10 * m15);
  n[ 2] = (m5 * m14 * m3 - m13 * m6 * m3 + m13 * m2 * m7 - m1 * m14 * m7 - m5 * m2 * m15 + m1 * m6 * m15);
  n[ 3] = (m9 * m6 * m3 - m5 * m10 * m3 - m9 * m2 * m7 + m1 * m10 * m7 + m5 * m2 * m11 - m1 * m6 * m11);

  n[ 4] = (m12 * m10 * m7 - m8 * m14 * m7 - m12 * m6 * m11 + m4 * m14 * m11 + m8 * m6 * m15 - m4 * m10 * m15);
  n[ 5] = (m8 * m14 * m3 - m12 * m10 * m3 + m12 * m2 * m11 - m0 * m14 * m11 - m8 * m2 * m15 + m0 * m10 * m15);
  n[ 6] = (m12 * m6 * m3 - m4 * m14 * m3 - m12 * m2 * m7 + m0 * m14 * m7 + m4 * m2 * m15 - m0 * m6 * m15);
  n[ 7] = (m4 * m10 * m3 - m8 * m6 * m3 + m8 * m2 * m7 - m0 * m10 * m7 - m4 * m2 * m11 + m0 * m6 * m11);

  n[ 8] = (m8 * m13 * m7 - m12 * m9 * m7 + m12 * m5 * m11 - m4 * m13 * m11 - m8 * m5 * m15 + m4 * m9 * m15);
  n[ 9] = (m12 * m9 * m3 - m8 * m13 * m3 - m12 * m1 * m11 + m0 * m13 * m11 + m8 * m1 * m15 - m0 * m9 * m15);
  n[10] = (m4 * m13 * m3 - m12 * m5 * m3 + m12 * m1 * m7 - m0 * m13 * m7 - m4 * m1 * m15 + m0 * m5 * m15);
  n[11] = (m8 * m5 * m3 - m4 * m9 * m3 - m8 * m1 * m7 + m0 * m9 * m7 + m4 * m1 * m11 - m0 * m5 * m11);

  n[12] = (m12 * m9 * m6 - m8 * m13 * m6 - m12 * m5 * m10 + m4 * m13 * m10 + m8 * m5 * m14 - m4 * m9 * m14);
  n[13] = (m8 * m13 * m2 - m12 * m9 * m2 + m12 * m1 * m10 - m0 * m13 * m10 - m8 * m1 * m14 + m0 * m9 * m14);
  n[14] = (m12 * m5 * m2 - m4 * m13 * m2 - m12 * m1 * m6 + m0 * m13 * m6 + m4 * m1 * m14 - m0 * m5 * m14);
  n[15] = (m4 * m9 * m2 - m8 * m5 * m2 + m8 * m1 * m6 - m0 * m9 * m6 - m4 * m1 * m10 + m0 * m5 * m10);

  var s = 1.0 / (
      m12 * m9 * m6 * m3 - m8 * m13 * m6 * m3 - m12 * m5 * m10 * m3 + m4 * m13 * m10 * m3 +
      m8 * m5 * m14 * m3 - m4 * m9 * m14 * m3 - m12 * m9 * m2 * m7 + m8 * m13 * m2 * m7 +
      m12 * m1 * m10 * m7 - m0 * m13 * m10 * m7 - m8 * m1 * m14 * m7 + m0 * m9 * m14 * m7 +
      m12 * m5 * m2 * m11 - m4 * m13 * m2 * m11 - m12 * m1 * m6 * m11 + m0 * m13 * m6 * m11 +
      m4 * m1 * m14 * m11 - m0 * m5 * m14 * m11 - m8 * m5 * m2 * m15 + m4 * m9 * m2 * m15 +
      m8 * m1 * m6 * m15 - m0 * m9 * m6 * m15 - m4 * m1 * m10 * m15 + m0 * m5 * m10 * m15
    );
  for (var i = 0; i < 16; ++i) {
    n[i] *= s;
  }
  return n;
}

traceMat4 = function(m) {
  return (m[0] + m[5] + m[10] + m[15]);
}

translationMat4v = function(v) {
  var m = identityMat4();
  m[12] = v[0];
  m[13] = v[1];
  m[14] = v[2];
  return m;
}

translationMat4c = function(x, y, z) {
  return translationMat4v([x,y,z]);
}

translationMat4s = function(s) {
  return translationMat4c(s, s, s);
}

rotationMat4v = function(anglerad, axis) {
  var ax = normalizeVec4([axis[0],axis[1],axis[2],0.0]);
  var s = Math.sin(anglerad);
  var c = Math.cos(anglerad);
  var q = 1.0 - c;

  var x = ax[0];
  var y = ax[1];
  var z = ax[2];

  var xx,yy,zz,xy,yz,zx,xs,ys,zs;

  xx = x * x;
  yy = y * y;
  zz = z * z;
  xy = x * y;
  yz = y * z;
  zx = z * x;
  xs = x * s;
  ys = y * s;
  zs = z * s;

  var m = mat4();

  m[0] = (q * xx) + c;
  m[1] = (q * xy) + zs;
  m[2] = (q * zx) - ys;
  m[3] = 0.0;

  m[4] = (q * xy) - zs;
  m[5] = (q * yy) + c;
  m[6] = (q * yz) + xs;
  m[7] = 0.0;

  m[8] = (q * zx) + ys;
  m[9] = (q * yz) - xs;
  m[10] = (q * zz) + c;
  m[11] = 0.0;

  m[12] = 0.0;
  m[13] = 0.0;
  m[14] = 0.0;
  m[15] = 1.0;

  return m;
}

rotationMat4c = function(anglerad, x, y, z) {
  return rotationMat4v(anglerad, [x,y,z]);
}

scalingMat4v = function(v) {
  var m = identityMat4();
  m[0] = v[0];
  m[5] = v[1];
  m[10] = v[2];
  return m;
}

scalingMat4c = function(x, y, z) {
  return scalingMat4v([x,y,z]);
}

scalingMat4s = function(s) {
  return scalingMat4c(s, s, s);
}

lookAtMat4v = function(pos, target, up) {
  var pos4 = [pos[0],pos[1],pos[2],0.0];
  var target4 = [target[0],target[1],target[2],0.0];
  var up4 = [up[0],up[1],up[2],0.0];

  var v = normalizeVec4(subVec4(target4, pos4));
  var u = normalizeVec4(up4);
  var s = normalizeVec4(cross3Vec4(v, u));

  u = normalizeVec4(cross3Vec4(s, v));

  var m = mat4();

  m[0] = s[0];
  m[1] = u[0];
  m[2] = -v[0];
  m[3] = 0.0;

  m[4] = s[1];
  m[5] = u[1];
  m[6] = -v[1];
  m[7] = 0.0;

  m[8] = s[2];
  m[9] = u[2];
  m[10] = -v[2];
  m[11] = 0.0;

  m[12] = 0.0;
  m[13] = 0.0;
  m[14] = 0.0;
  m[15] = 1.0;

  m = mulMat4(m, translationMat4v(negateVector4(pos4)));

  return m;
}

lookAtMat4c = function(posx, posy, posz, targetx, targety, targetz, upx, upy, upz) {
  return lookAtMat4v([posx,posy,posz], [targetx,targety,targetz], [upx,upy,upz]);
}

orthoMat4v = function(omin, omax) {
  var omin4 = [omin[0],omin[1],omin[2],0.0];
  var omax4 = [omax[0],omax[1],omax[2],0.0];
  var vsum = addVec4(omax4, omin4);
  var vdif = subVec4(omax4, omin4);

  var m = mat4();

  m[0] = 2.0 / vdif[0];
  m[1] = 0.0;
  m[2] = 0.0;
  m[3] = 0.0;

  m[4] = 0.0;
  m[5] = 2.0 / vdif[1];
  m[6] = 0.0;
  m[7] = 0.0;

  m[8] = 0.0;
  m[9] = 0.0;
  m[10] = -2.0 / vdif[2];
  m[11] = 0.0;

  m[12] = -vsum[0] / vdif[0];
  m[13] = -vsum[1] / vdif[1];
  m[14] = -vsum[2] / vdif[2];
  m[15] = 1.0;

  return m;
}

orthoMat4c = function(left, right, bottom, top, znear, zfar) {
  return orthoMat4v([left,bottom,znear], [right,top,zfar]);
}

frustumMat4v = function(fmin, fmax) {
  var fmin4 = [fmin[0],fmin[1],fmin[2],0.0];
  var fmax4 = [fmax[0],fmax[1],fmax[2],0.0];
  var vsum = addVec4(fmax4, fmin4);
  var vdif = subVec4(fmax4, fmin4);
  var t = 2.0 * fmin4[2];

  var m = mat4();

  m[0] = t / vdif[0];
  m[1] = 0.0;
  m[2] = 0.0;
  m[3] = 0.0;

  m[4] = 0.0;
  m[5] = t / vdif[1];
  m[6] = 0.0;
  m[7] = 0.0;

  m[8] = vsum[0] / vdif[0];
  m[9] = vsum[1] / vdif[1];
  m[10] = -vsum[2] / vdif[2];
  m[11] = -1.0;

  m[12] = 0.0;
  m[13] = 0.0;
  m[14] = -t * fmax4[2] / vdif[2];
  m[15] = 0.0;

  return m;
}

frustumMatrix4 = function(left, right, bottom, top, znear, zfar) {
  return frustumMat4v([left, bottom, znear], [right, top, zfar]);
}

perspectiveMatrix4 = function(fovyrad, aspectratio, znear, zfar) {
  var pmin = new Array(4);
  var pmax = new Array(4);

  pmin[2] = znear;
  pmax[2] = zfar;

  pmax[1] = pmin[2] * Math.tan(fovyrad / 2.0);
  pmin[1] = -pmax[1];

  pmax[0] = pmax[1] * aspectratio;
  pmin[0] = -pmax[0];

  return frustumMat4v(pmin, pmax);
};

transformPoint3 = function(m, p) {
  return [
    (m[0] * p[0]) + (m[4] * p[1]) + (m[8] * p[2]) + m[12],
    (m[1] * p[0]) + (m[5] * p[1]) + (m[9] * p[2]) + m[13],
    (m[2] * p[0]) + (m[6] * p[1]) + (m[10] * p[2]) + m[14],
    (m[3] * p[0]) + (m[7] * p[1]) + (m[11] * p[2]) + m[15]
  ];
}

transformPoints3 = function(m, points) {
  var result = new Array(points.length);
  var len = points.length;
  for (var i = 0; i < len; i++) {
    result[i] = transformPoint3(m, points[i]);
  }
  return result;
}

transformVector3 = function(m, v) {
  return [
    (m[0] * v[0]) + (m[4] * v[1]) + (m[8] * v[2]),
    (m[1] * v[0]) + (m[5] * v[1]) + (m[9] * v[2]),
    (m[2] * v[0]) + (m[6] * v[1]) + (m[10] * v[2])
  ];
}

projectVec4 = function(v) {
  var f = 1.0 / v[3];
  return [v[0] * f, v[1] * f, v[2] * f, 1.0];
}

Plane3 = function (normal, offset, normalize) {
  this.normal = [0.0, 0.0, 1.0 ];
  this.offset = 0.0;
  if (normal && offset) {
    this.normal[0] = normal[0];
    this.normal[1] = normal[1];
    this.normal[2] = normal[2];
    this.offset = offset;

    if (normalize) {
      var s = Math.sqrt(
            this.normal[0] * this.normal[0] +
            this.normal[1] * this.normal[1] +
            this.normal[2] * this.normal[2]
              );
      if (s > 0.0) {
        s = 1.0 / s;
        this.normal[0] *= s;
        this.normal[1] *= s;
        this.normal[2] *= s;
        this.offset *= s;
      }
    }
  }
}

MAX_DOUBLE = 1000000000000.0;

MIN_DOUBLE = -1000000000000.0;

Box3 = function(min, max) {
  this.min = min || [ MAX_DOUBLE,MAX_DOUBLE,MAX_DOUBLE ];
  this.max = max || [ MIN_DOUBLE,MIN_DOUBLE,MIN_DOUBLE ];

  this.init = function(min, max) {
    for (var i = 0; i < 3; ++i) {
      this.min[i] = min[i];
      this.max[i] = max[i];
    }
    return this;
  };

  this.fromPoints = function(points) {
    var points2 = [];
    for (var i = 0; i < points.length; i++) {
      points2.push([points[i][0] / points[i][3], points[i][1] / points[i][3], points[i][2] / points[i][3]]);
    }
    points = points2;
    for (var i = 0; i < points.length; i++) {
      var v = points[i];
      for (var j = 0; j < 3; j++) {
        if (v[j] < this.min[j]) {
          this.min[j] = v[j];
        }
        if (v[j] > this.max[j]) {
          this.max[j] = v[j];
        }
      }
    }
    return this;
  };

  this.isEmpty = function() {
    return (
      (this.min[0] >= this.max[0])
        && (this.min[1] >= this.max[1])
        && (this.min[2] >= this.max[2])
      );
  };

  this.getCenter = function() {
    return [
      (this.max[0] + this.min[0]) / 2.0,
      (this.max[1] + this.min[1]) / 2.0,
      (this.max[2] + this.min[2]) / 2.0
    ];
  };

  this.getSize = function() {
    return [
      (this.max[0] - this.min[0]),
      (this.max[1] - this.min[1]),
      (this.max[2] - this.min[2])
    ];
  };

  this.getFacesAreas = function() {
    var s = this.size;
    return [
      (s[1] * s[2]),
      (s[0] * s[2]),
      (s[0] * s[1])
    ];
  };

  this.getSurfaceArea = function() {
    var a = this.getFacesAreas();
    return ((a[0] + a[1] + a[2]) * 2.0);
  };

  this.getVolume = function() {
    var s = this.size;
    return (s[0] * s[1] * s[2]);
  };

  this.getOffset = function(half_delta) {
    for (var i = 0; i < 3; ++i) {
      this.min[i] -= half_delta;
      this.max[i] += half_delta;
    }
    return this;
  };
}

AxisBox3 = function(min, max) {
  this.verts = [
    [min[0], min[1], min[2]],
    [max[0], min[1], min[2]],
    [max[0], max[1], min[2]],
    [min[0], max[1], min[2]],

    [min[0], min[1], max[2]],
    [max[0], min[1], max[2]],
    [max[0], max[1], max[2]],
    [min[0], max[1], max[2]]
  ];

  this.toBox3 = function() {
      var box = new Box3();
      for (var i = 0; i < 8; i++) {
        var v = this.verts[i];
        for (var j = 0; j < 3; j++) {
          if (v[j] < box.min[j]) {
            box.min[j] = v[j];
          }
          if (v[j] > box.max[j]) {
            box.max[j] = v[j];
          }
        }
      }
  };
}

Sphere3 = function(center, radius) {
  this.center = [center[0], center[1], center[2] ];
  this.radius = radius;

  this.isEmpty = function() {
    return (this.radius == 0.0);
  };

  this.surfaceArea = function() {
    return (4.0 * Math.PI * this.radius * this.radius);
  };

  this.getVolume = function() {
    return ((4.0 / 3.0) * Math.PI * this.radius * this.radius * this.radius);
  };
}

billboardMat = function(viewMatrix) {
  var rotVec = [
    getColMat4(viewMatrix, 0),
    getColMat4(viewMatrix, 1),
    getColMat4(viewMatrix, 2)
  ];

  var scaleVec = [
    lenVec4(rotVec[0]),
    lenVec4(rotVec[1]),
    lenVec4(rotVec[2])
  ];

  var scaleVecRcp = rcpVec3(scaleVec);
  var sMat = scalingMat4v(scaleVec);
  var sMatInv = scalingMat4v(scaleVecRcp);

  rotVec[0] = mulVec4Scalar(rotVec[0], scaleVecRcp[0]);
  rotVec[1] = mulVec4Scalar(rotVec[1], scaleVecRcp[1]);
  rotVec[2] = mulVec4Scalar(rotVec[2], scaleVecRcp[2]);

  var rotMatInverse = identityMat4();

  setRowMat4(rotMatInverse, 0, rotVec[0]);
  setRowMat4(rotMatInverse, 1, rotVec[1]);
  setRowMat4(rotMatInverse, 2, rotVec[2]);

  return mulMat4(rotMatInverse, sMat);
}

FrustumPlane =  function(nx, ny, nz, offset) {
  var s = 1.0 / Math.sqrt(nx * nx + ny * ny + nz * nz);
  this.normal = [nx * s, ny * s, nz * s];
  this.offset = offset * s;
  this.testVertex = [
    (this.normal[0] >= 0.0) ? (1) : (0),
    (this.normal[1] >= 0.0) ? (1) : (0),
    (this.normal[2] >= 0.0) ? (1) : (0)];
}

OUTSIDE_FRUSTUM = 3;
INTERSECT_FRUSTUM = 4;
INSIDE_FRUSTUM = 5;

Frustum =  function(viewMatrix, projectionMatrix, viewport) {
  var m = mulMat4(projectionMatrix, viewMatrix);
  var q = [ m[3], m[7], m[11] ];
  var planes = [
    new FrustumPlane(q[ 0] - m[ 0], q[ 1] - m[ 4], q[ 2] - m[ 8], m[15] - m[12]),
    new FrustumPlane(q[ 0] + m[ 0], q[ 1] + m[ 4], q[ 2] + m[ 8], m[15] + m[12]),
    new FrustumPlane(q[ 0] - m[ 1], q[ 1] - m[ 5], q[ 2] - m[ 9], m[15] - m[13]),
    new FrustumPlane(q[ 0] + m[ 1], q[ 1] + m[ 5], q[ 2] + m[ 9], m[15] + m[13]),
    new FrustumPlane(q[ 0] - m[ 2], q[ 1] - m[ 6], q[ 2] - m[10], m[15] - m[14]),
    new FrustumPlane(q[ 0] + m[ 2], q[ 1] + m[ 6], q[ 2] + m[10], m[15] + m[14])
  ];

  /* Resources for LOD
   */
  var rotVec = [
    getColMat4(viewMatrix, 0),
    getColMat4(viewMatrix, 1),
    getColMat4(viewMatrix, 2)
  ];

  var scaleVec = [
    lenVec4(rotVec[0]),
    lenVec4(rotVec[1]),
    lenVec4(rotVec[2])
  ];

  var scaleVecRcp = rcpVec3(scaleVec);
  var sMat = scalingMat4v(scaleVec);
  var sMatInv = scalingMat4v(scaleVecRcp);

  rotVec[0] = mulVec4Scalar(rotVec[0], scaleVecRcp[0]);
  rotVec[1] = mulVec4Scalar(rotVec[1], scaleVecRcp[1]);
  rotVec[2] = mulVec4Scalar(rotVec[2], scaleVecRcp[2]);

  var rotMatInverse = identityMat4();

  setRowMat4(rotMatInverse, 0, rotVec[0]);
  setRowMat4(rotMatInverse, 1, rotVec[1]);
  setRowMat4(rotMatInverse, 2, rotVec[2]);

  this.matrix = mulMat4(projectionMatrix, viewMatrix);
  this.billboardMatrix = mulMat4(sMatInv, mulMat4(rotMatInverse, sMat));
  this.viewport = viewport.slice(0, 4);

  this.textAxisBoxIntersection = function(box) {
    var ret = INSIDE_FRUSTUM;
    var bminmax = [ box.min, box.max ];
    var plane = null;
    for (var i = 0; i < 6; ++i) {
      plane = planes[i];
      if (((plane.normal[0] * bminmax[plane.testVertex[0]][0]) +
           (plane.normal[1] * bminmax[plane.testVertex[1]][1]) +
           (plane.normal[2] * bminmax[plane.testVertex[2]][2]) +
           (plane.offset)) < 0.0) {
        return OUTSIDE_FRUSTUM;
      }

      if (((plane.normal[0] * bminmax[1 - plane.testVertex[0]][0]) +
           (plane.normal[1] * bminmax[1 - plane.testVertex[1]][1]) +
           (plane.normal[2] * bminmax[1 - plane.testVertex[2]][2]) +
           (plane.offset)) < 0.0) {
        ret = INTERSECT_FRUSTUM;
      }
    }
    return ret;
  };

  this.getProjectedSize = function(box) {
    var diagVec = subVec3(box.max, box.min);

    var diagSize = lenVec3(diagVec);

    var size = Math.abs(diagSize);

    var p0 = [
      (box.min[0] + box.max[0]) * 0.5,
      (box.min[1] + box.max[1]) * 0.5,
      (box.min[2] + box.max[2]) * 0.5,
      0.0];

    var halfSize = size * 0.5;
    var p1 = [ -halfSize, 0.0, 0.0, 1.0 ];
    var p2 = [  halfSize, 0.0, 0.0, 1.0 ];

    p1 = mulMat4v4(this.billboardMatrix, p1);
    p1 = addVec4(p1, p0);
    p1 = projectVec4(mulMat4v4(this.matrix, p1));

    p2 = mulMat4v4(this.billboardMatrix, p2);
    p2 = addVec4(p2, p0);
    p2 = projectVec4(mulMat4v4(this.matrix, p2));

    return viewport[2] * Math.abs(p2[0] - p1[0]);
  };
}

identityQuaternion = function() {
  return [ 0.0, 0.0, 0.0, 1.0 ];
}

angleAxisQuaternion = function(x, y, z, degrees) {
  var angleRad = (degrees / 180.0) * Math.PI;
  var halfAngle = angleRad / 2.0;
  var fsin = Math.sin(halfAngle);
  return [
    fsin * x,
    fsin * y,
    fsin * z,
    Math.cos(halfAngle)
  ];
}

mulQuaternions = function(p, q) {
  return [
    p[3] * q[0] + p[0] * q[3] + p[1] * q[2] - p[2] * q[1],
    p[3] * q[1] + p[1] * q[3] + p[2] * q[0] - p[0] * q[2],
    p[3] * q[2] + p[2] * q[3] + p[0] * q[1] - p[1] * q[0],
    p[3] * q[3] - p[0] * q[0] - p[1] * q[1] - p[2] * q[2]
  ];
}

newMat4FromQuaternion = function(q) {
  var tx = 2.0 * q[0];
  var ty = 2.0 * q[1];
  var tz = 2.0 * q[2];
  var twx = tx * q[3];
  var twy = ty * q[3];
  var twz = tz * q[3];
  var txx = tx * q[0];
  var txy = ty * q[0];
  var txz = tz * q[0];
  var tyy = ty * q[1];
  var tyz = tz * q[1];
  var tzz = tz * q[2];
  var m = identityMat4();
  setCellMat4(m, 0, 0, 1.0 - (tyy + tzz));
  setCellMat4(m, 0, 1, txy - twz);
  setCellMat4(m, 0, 2, txz + twy);
  setCellMat4(m, 1, 0, txy + twz);
  setCellMat4(m, 1, 1, 1.0 - (txx + tzz));
  setCellMat4(m, 1, 2, tyz - twx);
  setCellMat4(m, 2, 0, txz - twy);
  setCellMat4(m, 2, 1, tyz + twx);
  setCellMat4(m, 2, 2, 1.0 - (txx + tyy));
  return m;
}

slerp = function(t, q1, q2) {
  var result = identityQuaternion();
  var q13 = q1[3] * 0.0174532925;
  var q23 = q2[3] * 0.0174532925;
  var cosHalfAngle = q13 * q23 + q1[0] * q2[0] + q1[1] * q2[1] + q1[2] * q2[2];
  if (Math.abs(cosHalfAngle) >= 1) {
      return [ q1[0],q1[1], q1[2], q1[3] ];
  } else {
    var halfAngle = Math.acos(cosHalfAngle);
    var sinHalfAngle = Math.sqrt(1 - cosHalfAngle * cosHalfAngle);
    if (Math.abs(sinHalfAngle) < 0.001) {
      return [
        q1[0] * 0.5 + q2[0] * 0.5,
        q1[1] * 0.5 + q2[1] * 0.5,
        q1[2] * 0.5 + q2[2] * 0.5,
        q1[3] * 0.5 + q2[3] * 0.5
      ];
    } else {
        var a = Math.sin((1 - t) * halfAngle) / sinHalfAngle;
        var b = Math.sin(t * halfAngle) / sinHalfAngle;
        return [
          q1[0] * a + q2[0] * b,
          q1[1] * a + q2[1] * b,
          q1[2] * a + q2[2] * b,
          (q13 * a + q23 * b) * 57.295779579
        ];
    }
  }
}

normalizeQuaternion = function(q) {
  var len = lenVec3([q[0], q[1], q[2]]);
  return [ q[0] / len, q[1] / len, q[2] / len, q[3] / len ];
}

angleAxisFromQuaternion = function(q) {
  q = normalizeQuaternion(q);
  var angle = 2 * Math.acos(q[3]);
  var s = Math.sqrt(1 - q[3] * q[3]);
  if (s < 0.001) { // test to avoid divide by zero, s is always positive due to sqrt
    return {
      x : q[0],
      y : q[1],
      z : q[2],
      angle: angle
    };
  } else {
    return {
      x : q[0] / s,
      y : q[1] / s,
      z : q[2] / s,
      angle: angle
    };
  }
}
