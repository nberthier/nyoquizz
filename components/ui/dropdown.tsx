'use client';

import autoAnimate from '@formkit/auto-animate';
import { useEffect, useRef, useState } from 'react';

const Dropdown = () => {
  const [show, setShow] = useState(false);
  const parent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (parent.current) autoAnimate(parent.current);
  }, [parent]);

  const reveal = () => setShow(!show);

  return (
    <div ref={parent}>
      <strong className="dropdown-label" onClick={reveal}>
        Click me to open!
      </strong>
      {show && <p className="dropdown-content">Lorum ipsum...</p>}
    </div>
  );
};

export { Dropdown };
