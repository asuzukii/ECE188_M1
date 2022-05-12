import React, { useRef, useState, useEffect } from "react";
import {Hands, HAND_CONNECTIONS} from '@mediapipe/hands';
import {drawConnectors, drawLandmarks} from '@mediapipe/drawing_utils';
import {Camera} from '@mediapipe/camera_utils';
import Webcam from 'react-webcam';
import './index.css';
import '@tensorflow/tfjs-backend-cpu';
import * as tf from '@tensorflow/tfjs-core';
import * as tflite from '@tensorflow/tfjs-tflite';
import { norm } from "@tensorflow/tfjs-core";
import { startIndicesWithElidedDims } from "@tensorflow/tfjs-core/dist/ops/slice_util";

tflite.setWasmPath(
  'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite@0.0.1-alpha.8/dist/'
);

const Gesture = (props) => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [nums, setNums] = useState([]);
    const [out, setOut] = useState(props.value);
    useEffect(() => console.log(nums), [nums]);
    var camera = null;
    const sendData = (input) => {
      props.parentCallback(input);
    }

    const majorityElement = (arr = []) => {
      const threshold = Math.floor(arr.length / 2);
      const map = {};
      for (let i = 0; i < arr.length; i++) {
         const value = arr[i];
         map[value] = map[value] + 1 || 1;
         if (map[value] > threshold)
            return value
      };
      return false;
   };

    const onResults = async (results) => {
        const tfliteModel = await tflite.loadTFLiteModel('http://localhost:8080/keypoint_classifier.tflite');
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        // Set canvas width
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        const canvasElement = canvasRef.current;
        const canvasCtx = canvasElement.getContext("2d");
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(
            results.image, 0, 0, canvasElement.width, canvasElement.height);
        if (results.multiHandLandmarks) {
            for (const landmarks of results.multiHandLandmarks) {
              let arr = [];
              let array1D = [];
              for (const coord of landmarks) {
                arr.push([Math.min(Math.floor(coord.x * canvasElement.width), canvasElement.width - 1),
                  Math.min(Math.floor(coord.y * canvasElement.height), canvasElement.height - 1)
                ]);
              }
              let x = 0, y = 0;
              for (let i = 0; i < 21; i++) {
                if (i === 0) {
                  x = arr[i][0];
                  y = arr[i][1];
                }
                arr[i][0] -= x;
                arr[i][1] -= y;
                array1D.push(arr[i][0]);
                array1D.push(arr[i][1]);
              }
              let array1D_abs = array1D.map(x => Math.abs(x));
              const max_val = Math.max(...array1D_abs);
              const normalized_array_1D = array1D.map(x => x / max_val);
              const tensor = tf.tensor([normalized_array_1D]);
              const outputTensor = tfliteModel.predict(tensor);
              let max_num = -1;
              let max_idx = -1;
              for (let i = 0; i < 3; i++) {
                if (outputTensor.dataSync()[i] > max_num) {
                  max_num = outputTensor.dataSync()[i];
                  max_idx = i;
                }
              }
              console.log("Max_idx:" + max_idx);
              
              if (nums.length <= 10) {
                setNums(nums => [...nums, max_idx]);
                } else {
                console.log("ran there");
                switch (majorityElement(nums)) {
                  case 0:
                    sendData(out + '✋');
                    setNums(nums => []);
                    setOut(out => out + '✋');
                    break;
                  case 1:
                    sendData(out + '☝🏻');
                    setNums(nums => []);
                    setOut(out => out + '☝🏻');
                    break;
                  case 2:
                    sendData(out + '✊');
                    setNums(nums => []);
                    setOut(out => out + '✊');
                    break;
                  default:
                    break;
              }}
              drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                            {color: '#00FF00', lineWidth: 3});
              drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 1});
            }
        }
        canvasCtx.restore();
    }
    // }

    useEffect(() => {
      const hands = new Hands({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }});
  
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
  
      hands.onResults(onResults);
  
      if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null
      ) {
        camera = new Camera(webcamRef.current.video, {
          onFrame: async () => {
            await hands.send({ image: webcamRef.current.video });
          },
          width: 320,
          height: 240,
        });
        camera.start();
      }
    }, []);
    return (
        <div>

          <Webcam
            ref={webcamRef}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zindex: 9,
              width: 320,
              height: 240,
            }}
          />
          <canvas
            ref={canvasRef}
            className="output_canvas"
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zindex: 9,
              width: 320,
              height: 240,
            }}
          ></canvas>
        </div>
    );
  }
  
  export default Gesture;