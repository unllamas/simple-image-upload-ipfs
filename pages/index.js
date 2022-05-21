import { useState } from 'react';
import Link from 'next/link';

import { useAppContext } from '../context';

export default function Home() {
  // Remove from here
  document.querySelector('body').style.backgroundColor = '#FDFDFD';

  const { ipfs } = useAppContext();
  const [file, setFile] = useState();
  const [path, setPath] = useState('');
  const [filePreview, setPreviewFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleReadURL = (e) => {
    var file = e.target.files[0];
    setFile(file);
    var reader = new FileReader();
    reader.onload = function (event) {
      setPreviewFile(event.target.result);
    };

    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    setLoading(true);
    try {
      const res = await ipfs.add(file);
      if (res) {
        setPath(res.path);
        setLoading(false);
      }
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  };

  const handleCancel = () => {
    setPreviewFile(null);
    setPath('');
  };

  return (
    <div className='page'>
      <div className='container centered'>
        {!filePreview ? (
          <div className='box-drag'>
            <input type='file' onChange={handleReadURL} accept='image/*' />
            <div className='body'>
              <h3>
                <span>Drag and drop</span> a file or <br /> select add Image
              </h3>
            </div>
          </div>
        ) : (
          <div className='section'>
            <div className='box-preview' style={{ opacity: path ? '.4' : '1' }}>
              <div className='header' style={{ backgroundImage: `url('${filePreview}')` }}></div>
              <div className='body'>
                <span>{file.type}</span>
                <p className='name'>{file.name}</p>
              </div>
            </div>
            <div className='button-group'>
              {path ? (
                <Link href={`/ipfs/${path}`} replace>
                  <a className='button primary'>See image</a>
                </Link>
              ) : (
                <button className='button' onClick={() => handleUpload()} disabled={loading}>
                  Upload
                </button>
              )}
              <button className='button secondary' onClick={() => handleCancel()} disabled={loading}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <footer>
        <p>
          Created with 🖤 by{' '}
          <Link href='https://twitter.com/unllamas'>
            <a className='link' target='_blank'>
              @unllamas
            </a>
          </Link>
        </p>
      </footer>
    </div>
  );
}
