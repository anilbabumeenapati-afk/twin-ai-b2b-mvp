import * as mpPose from "@mediapipe/pose";
import * as cam from "@mediapipe/camera_utils";

export default function usePostureCheck(videoRef, onResult) {
  const pose = new mpPose.Pose({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
  });

  pose.setOptions({ modelComplexity: 1, smoothLandmarks: true });

  pose.onResults((results) => {
    if (results.poseLandmarks) {
      const nose = results.poseLandmarks[0];
      const leftShoulder = results.poseLandmarks[11];
      const rightShoulder = results.poseLandmarks[12];
      const slouch =
        Math.abs(leftShoulder.y - rightShoulder.y) > 0.05 ? "Tilt" : "OK";
      onResult(slouch);
    }
  });

  let camera = null;
  if (typeof window !== "undefined" && videoRef.current) {
    camera = new cam.Camera(videoRef.current, {
      onFrame: async () => {
        await pose.send({ image: videoRef.current });
      },
    });
    camera.start();
  }
}
