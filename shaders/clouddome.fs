/**
 * Precomputed Atmospheric Scattering
 * Copyright (c) 2008 INRIA
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holders nor the names of its
 *    contributors may be used to endorse or promote products derived from
 *    this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
 * THE POSSIBILITY OF SUCH DAMAGE.
 */

#ifdef GL_ES
precision highp float;
#endif

// Main.h
const float Rg = 6360.0;

// common.glsl
const float M_PI = 3.141592657;

// 
const float ISun = 100.0;

uniform vec3 camera;
uniform vec3 sun;
uniform mat4 invProjection;
uniform mat4 invView;
uniform float exposure;

varying vec2 coords;
varying vec3 ray;

// direct sun light for ray x+tv, when sun in direction s (=L0)
vec3 sunColor(vec3 x, float t, vec3 v, vec3 s, float r, float mu) 
{
  if (t > 0.0)
  {
      return vec3(0.0);
  }
  else
  {
      //vec3 transmittance = r <= Rt ? transmittanceWithShadow(r, mu) : vec3(1.0); // T(x,xo)
      float isun = step(cos(M_PI / 180.0), dot(v, s)) * ISun; // Lsun
      //return transmittance * isun; // Eq (9)
      return vec3(isun, isun, isun);
  }
}

// High dynamic range calculation (with exposure)
vec3 HDR(vec3 L)
{
  L = L * exposure;
  L.r = L.r < 1.413 ? pow(L.r * 0.38317, 1.0 / 2.2) : 1.0 - exp(-L.r);
  L.g = L.g < 1.413 ? pow(L.g * 0.38317, 1.0 / 2.2) : 1.0 - exp(-L.g);
  L.b = L.b < 1.413 ? pow(L.b * 0.38317, 1.0 / 2.2) : 1.0 - exp(-L.b);
  return L;
}

void main(void) {
  // old: gl_FragColor = vec4(0.8, 0.8, 1.0, 1.0);

  // Calculate parameters  
  vec3 x = camera;
  vec3 v = normalize(ray);

  float r = length(x);
  float mu = dot(x, v) / r;
  float t = -r * mu - sqrt(r * r * (mu * mu - 1.0) + Rg * Rg);
  
  // Calculate the direct transmission of the sun color
  vec3 sunColor = sunColor(x, t, v, sun, r, mu); //L0
  
  // Calculate the inscatter color
  //todo
  vec3 inscatterColor = vec3(0.0);
  
  gl_FragColor = vec4(HDR(sunColor + inscatterColor), 1.0); // Eq (16)
}

