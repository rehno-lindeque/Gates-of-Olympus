/*
s_p_oneil@hotmail.com
Copyright (c) 2000, Sean O'Neil
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice,
  this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.
* Neither the name of this project nor the names of its contributors
  may be used to endorse or promote products derived from this software
  without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
*/

//
// Adapted from code by Sean O'Neil (GPU Gems 2, Chapter 16)
//
// Changes are copyright (c) 2010 Rehno Lindeque
// 

#ifdef GL_ES
precision highp float;
#endif

uniform vec3 sun;
uniform float g;    // The Mie phase asymmetry factor
uniform float gSqr;

varying vec3 viewDirection;
varying vec3 mieColor;
varying vec3 raleighColor;

void main (void)
{
  /*vec3 tmp = sun * g * g2;
  gl_FragColor = vec4(tmp * 0.00000000001, 0.0);
  gl_FragColor.rgb += viewDirection * 0.00000000001;*/

  //old: gl_FragColor = vec4(0.7, 0.75, 0.9, 1.0);
  float cosSunView = dot(sun, viewDirection) / length(viewDirection);
	float miePhase = 1.5 * ((1.0 - gSqr) / (2.0 + gSqr)) * (1.0 + cosSunView*cosSunView) / pow(1.0 + gSqr - 2.0*g*cosSunView, 1.5);
	gl_FragColor = vec4(raleighColor + miePhase * mieColor, 1.0);

  gl_FragColor.r = min(gl_FragColor.r, 1.0);
  gl_FragColor.g = min(gl_FragColor.g, 1.0);
  gl_FragColor.b = min(gl_FragColor.b, 1.0);

  //gl_FragColor = vec4(viewDirection / length(viewDirection), 1.0);
  //gl_FragColor.b *= -1.0;
}

