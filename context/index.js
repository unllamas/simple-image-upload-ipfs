import React, { createContext, useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import { create } from 'ipfs-core';

export const AppContext = createContext({
  id: '',
  version: '',
  isOnline: false,
  ipfs: {},
});

export function AppWrapper({ children }) {
  const [id, setId] = useState(null);
  const [ipfs, setIpfs] = useState(null);
  const [version, setVersion] = useState(null);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (ipfs) return;

      const node = await create();

      const nodeId = await node.id();
      const nodeVersion = await node.version();
      const nodeIsOnline = node.isOnline();

      setIpfs(node);
      setId(nodeId.id);
      setVersion(nodeVersion.version);
      setIsOnline(nodeIsOnline);
    };

    init();
  }, [ipfs]);

  if (!ipfs) {
    return (
      <>
        <div className='welcome'>
          <h2>Initializing node...</h2>
          <p>As we do not depend on a server, your device is responsible for storing all this information</p>
          <Link href='https://twitter.com/unllamas'>
            <a className='button primary'>Learn more</a>
          </Link>
        </div>
      </>
    );
  }

  return <AppContext.Provider value={{ id, version, isOnline, ipfs }}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
