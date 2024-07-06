import React, { useState } from 'react';
import Logo from '../Logo/Logo';


function AppBar() {
  const [isMaximize, setMaximize] = useState(false);

  const handleToggle = () => {
    if (isMaximize) {
      setMaximize(false);
    } else {
      setMaximize(true);
    }
    window.Main.Maximize();
  };

  return (
    <div className="flex justify-between draggable bg-solid-primary-dark text-solid-primary-light w-full">
      <div className='flex items-center justify-center p-5'>
        <Logo />
      </div>
      <div className="flex items-start">
        <button onClick={window.Main.Minimize} className="undraggable hover:bg-solid-primary-main px-2">
          &#8211;
        </button>
        <button onClick={handleToggle} className="undraggable hover:bg-solid-primary-main px-2">
          {isMaximize ? '\u2752' : '⃞'}
        </button>
        <button onClick={window.Main.Close} className="undraggable hover:bg-red-500 hover:text-white px-2">
          &#10005;
        </button>
      </div>
    </div>
  );
}

export default AppBar;
