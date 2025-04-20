import React, { useState } from "react";
import Spline from "@splinetool/react-spline";
import "./splineScene.css";

export default function SplineScene() {
	const [loading, setLoading] = useState(true);

	return (
		<div className="spline-container">
			<div className="spline-wrapper">
				<Spline
					scene="https://prod.spline.design/kDhqFlhjyD3hAdlL/scene.splinecode"
					onLoad={() => setLoading(false)}
				/>
			</div>
			{loading && <div className="spline-loading">Loading 3D scene...</div>}
		</div>
	);
}
