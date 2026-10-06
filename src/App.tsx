import type { Component, JSX } from 'solid-js';

const App: Component<{ children?: JSX.Element }> = (props) => {
  return (
    <>
      {/* Layout of the entire app */}
      {props.children}
    </>
  );
};

export default App; 
