'use client';

import React, { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div  style={{'padding': '16px'}}>
      <h3>Something went wrong!</h3>
      <button onClick={() => reset()} style={{ border: '1px solid #ddd', background: '#777', borderRadius: '5px', padding: '8px' }}>
        Reset page
      </button>
      <p> { JSON.stringify(error, Object.getOwnPropertyNames(error)) } </p>
    </div>
  );
}
