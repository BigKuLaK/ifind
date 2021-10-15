import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlink } from '@fortawesome/free-solid-svg-icons';

import './styles.scss';

const ImagePreview = ({ url }) => {
  const [ loading, setLoading ] = useState(false);
  const [ image, setImage ] = useState('');

  const loadImage = useCallback((url) => {
    setLoading(true);
    setImage('');

    const img = new Image();
    img.onload = onImageLoad;
    img.onerror = onImageError;
    img.src = url;
  }, [ onImageLoad, onImageError, setLoading ]);

  const onImageLoad = useCallback(({ target }) => {
    setImage(target.src);
    setLoading(false);
  }, [ setImage ]);

  const onImageError = useCallback(({ target }) => {
    console.error(`Image failed to load: ${target.src}`);
    setImage('');
    setLoading(false);
  }, [ url, setImage ]);

  useEffect(() => {
    if ( url ) {
      loadImage(url);
    } else {
      setImage('');
    }
  }, [ url, loadImage ]);

  return (
    <div className="image-preview">
      {
        (image && <img src={image} alt="" className="image-preview__preview" />)
        || (
          <div className="image-preview__icon">
            <FontAwesomeIcon icon={loading ? 'spinner' : 'unlink'} pulse={loading} />
          </div>
        )
      }
    </div>
  )
};

export default ImagePreview;