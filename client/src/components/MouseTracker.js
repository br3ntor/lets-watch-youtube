import React, { useState } from "react";

export default function MouseTracker() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  function handleMouseMove(event) {
    setCoords({ x: event.clientX, y: event.clientY });
  }

  return (
    <div style={{ height: "100vh" }} onMouseMove={handleMouseMove}>
      <h1>Move the mouse around!</h1>
      <p>
        The current mouse position is ({coords.x}, {coords.y})
      </p>
    </div>
  );
}
