import { useState, useEffect } from 'react';
import { useAppContext } from '../../context';
import toBuffer from 'it-to-buffer';

const CID = ({ cid }) => {
  const [image, setImage] = useState('');
  const { ipfs } = useAppContext();

  useEffect(() => {
    async function getCID() {
      const res = await ipfs.cat(cid);
      const buffer = await toBuffer(res);
      if (buffer) {
        const blob = new Uint8Array(buffer);
        let rawData = [...blob];
        let blob1 = new Blob([new Uint8Array(rawData)]);
        setImage(URL.createObjectURL(blob1));
      }
    }

    !image && getCID();
  });

  if (!image) return null;

  return (
    <>
      <img src={image} width='100%' />
    </>
  );
};

export async function getServerSideProps({ query }) {
  const { cid } = query;
  return {
    props: {
      cid,
    },
  };
}

export default CID;
