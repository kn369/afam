import { useState } from "react";
import Spline from "@splinetool/react-spline";
import "./background.css";

export default function Background() {
	const [loading, setLoading] = useState(true);

	return (
		<div className="background-container">
			{loading && (
				<div className="background-loading">Loading background...</div>
			)}
			<Spline
				scene="https://prod.spline.design/o9suDeisb2adKvFu/scene.splinecode"
				onLoad={() => setLoading(false)}
			/>
		</div>
	);
}
