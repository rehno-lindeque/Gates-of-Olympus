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

attribute vec2 vertexPosition;

// using a vec2 representing the first two diagonals of the corresponding inverse projection matrix, 
// but with a near plane of 1.0.
uniform vec2 invProjection;
uniform mat3 invView;

//old... uniform vec3 camera;
uniform vec3 sun;

uniform vec3 invWavelength;         // 1 / pow(wavelength, 4) for the red, green, and blue channels
uniform float cameraHeight;
uniform float cameraHeightSqr;
uniform float innerRadius;		      // The inner (atmosphere) radius
//uniform float outerRadius;		    // The outer (atmosphere) radius
uniform float outerRadiusSqr;
uniform float KrESun;			          // Kr * ESun
uniform float KmESun;			          // Km * ESun
uniform float Kr4PI;                // Kr * 4 * PI
uniform float Km4PI;                // Km * 4 * PI
uniform float scale;                // 1 / (outerRadius - innerRadius)
uniform float scaleDepth;           // The scale depth (i.e. the altitude at which the atmosphere's average density is found)
uniform float scaleDivScaleDepth;	  // scale / scaleDepth

const int nSamples = 8;
const float samples = 8.0;

varying vec3 viewDirection;
varying vec3 mieColor;
varying vec3 raleighColor;

float applyScale(float cosAngle)
{
	float x = 1.0 - cosAngle;
	return scaleDepth * exp(-0.00287 + x*(0.459 + x*(3.83 + x*(-6.80 + x*5.25))));
}

void main(void)
{
  gl_Position = vec4(vertexPosition, 0.0, 1.0);
	
  // Calculate the view direction in world space
  viewDirection = vec3(vertexPosition / invProjection, -1.0);
  viewDirection = invView * viewDirection;
 
  // OLD: (Remove) Calculate the farther intersection of the ray with the outer atmosphere (which is the far point of the ray passing through the atmosphere)
	//float B = 2.0 * dot(v3CameraPos, v3Ray);
  /*float B = 2.0 * viewDirection.y;
	float C = cameraHeightSqr - outerRadiusSqr;
	float det = max(0.0, B*B - 4.0 * C);
	float far = 0.5 * (-B + sqrt(det));*/

  // Calculate the ray's starting position
  // todo: perhaps we shouldn't normalize the ray direction, it could improve numerical accuracy if we simply
  //       store its length to use in later computations...
  vec3 ray = normalize(viewDirection); 

  // Calculate the intersection of the camera ray with the atmosphere's outer radius
  float rayZSqr = ray.z * ray.z;

  float far = -ray.z * cameraHeight + sqrt(rayZSqr * cameraHeightSqr - cameraHeightSqr + outerRadiusSqr);

  // Temporary: help with precision problems...
  far = min(far, sqrt(cameraHeightSqr + outerRadiusSqr));

  // Calculate the camera angle in relation to the atmosphere normal
  //float fStartAngle = dot(v3Ray, v3Start) / fHeight;
  float startCosAngle = ray.z;                    // Because the camera is static (camera position is (0, 0, cameraHeight))

  // Calculate the scattering offset
  float depth = exp(scaleDivScaleDepth * (innerRadius - cameraHeight));
	float startOffset = depth * applyScale(startCosAngle);

	// Initialize the scattering loop variables
  ////gl_FrontColor = vec4(0.0, 0.0, 0.0, 0.0);
  float sampleLength = far / samples;
  float scaledLength = sampleLength * scale;
  vec3 sampleRay = ray * sampleLength;
  vec3 samplePoint = vec3(0.0, 0.0, cameraHeight) + sampleRay * 0.5;

	// Loop through the sample rays
	vec3 color = vec3(0.0, 0.0, 0.0);
	for(int i = 0; i < nSamples; i++)
	{
		float height = length(samplePoint);
		float depth = exp(scaleDivScaleDepth * (innerRadius - height));
		float lightAngle = dot(sun, samplePoint) / height;
		float cameraAngle = dot(ray, samplePoint) / height;
		float scatter = (startOffset + depth * (applyScale(lightAngle) - applyScale(cameraAngle)));
		vec3 attenuate = exp(-scatter * (invWavelength * Kr4PI + Km4PI));
		color += attenuate * (depth * scaledLength);
		samplePoint += sampleRay;
	}

	// Scale the Mie and Rayleigh colors
	mieColor = color * KmESun;
	raleighColor = color * (invWavelength * KrESun);

  /*old (testing):* raleighColor = vec3(0.5, 0.55, 0.7);//*/
  /*old (testing):* mieColor = vec3(0.2,0.2,0.2);//*/
}
