import React, { useEffect, useRef, useState } from 'react';
import ViewGL from './ViewGL';

let viewGL;
export default function Scene() {

  // ******************* COMPONENT LIFECYCLE ******************* //
  // componentDidMount() {
  //   debugger;
  //   // Get canvas, pass to custom class
  //   const canvas = this.canvasRef.current;
  //   this.viewGL = new ViewGL(canvas);

  //   // Init any event listeners
  //   window.addEventListener('mousemove', this.mouseMove);
  //   window.addEventListener('resize', this.handleResize);
  // }

  // componentDidUpdate(prevProps, prevState) {
  //   // Pass updated props to 
  //   const newValue = this.props.whateverProperty;
  //   this.viewGL.updateValue(newValue);
  // }

  // componentWillUnmount() {
  //   // Remove any event listeners
  //   window.removeEventListener('mousemove', this.mouseMove);
  //   window.removeEventListener('resize', this.handleResize);
  // }

  // ******************* EVENT LISTENERS ******************* //
  // mouseMove = (event) => {
  //   this.viewGL.onMouseMove();
  // };

  // handleResize = () => {
  //   this.viewGL.onWindowResize(window.innerWidth, window.innerHeight);
  // };
  const canvas = React.useRef();
  const viewGlRef = React.useRef();

  const [viewGl, setviewGl] = useState(null)
  useEffect(() => {
    const context = canvas.current.getContext('2d');
    // debugger;b
    // draw(context);
    setviewGl(true)

  });
  return (
    <>
      <canvas ref={canvas} height={100} width={100} />
      {viewGl && <ViewGL canvasRef={canvas} ></ViewGL>}
    </>
  );
}


