'use client';

import React, { useRef, useState } from 'react';
import Head from 'next/head';
import Tesseract from 'tesseract.js';
import cv from '@techstark/opencv-js';

export default function Home() {
	const [image, setImage] = useState(null);
	const [text, setText] = useState('');
	const [imageDimensions, setImageDimensions] = useState({
		width: 0,
		height: 0,
	});
	const canvasRef = useRef(null);

	const handleImageUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const img = new Image();
				img.src = e.target.result;
				img.onload = () => {
					setImage(e.target.result);
					setImageDimensions({ width: img.width, height: img.height });
					processImageWithOpenCV(e.target.result, img.width, img.height);
				};
			};
			reader.readAsDataURL(file);
		}
	};

	const processImageWithOpenCV = (src, width, height) => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		const img = new Image();
		img.src = src;
		img.onload = () => {
			canvas.width = width;
			canvas.height = height;
			ctx.drawImage(img, 0, 0);

			const srcMat = cv.imread(canvas);
			const grayMat = new cv.Mat();
			cv.cvtColor(srcMat, grayMat, cv.COLOR_RGBA2GRAY, 0);
			cv.imshow(canvas, grayMat);
			srcMat.delete();
			grayMat.delete();

			Tesseract.recognize(canvas, 'eng', {
				logger: (m) => console.log(m),
			}).then(({ data: { text } }) => {
				setText(text);
			});
		};
	};

	return (
		<div>
			<Head>
				<title>OCR App</title>
			</Head>
			<h1>OCR App with OpenCV.js and Tesseract.js</h1>
			<input type='file' onChange={handleImageUpload} />
			<canvas ref={canvasRef} style={{ display: 'none' }} />
			{image && (
				<img
					src={image}
					alt='Uploaded'
					width={imageDimensions.width}
					height={imageDimensions.height}
				/>
			)}
			<div>
				<h2>Extracted Text:</h2>
				<p>{text}</p>
			</div>
		</div>
	);
}
