import React, { useRef, useEffect, useCallback } from 'react';
import JSONFormatter from 'json-formatter-js';

import './styles.scss';

const jsonFormatterConfig = {
  hoverPreviewEnabled: true,
  hoverPreviewArrayCount: 100,
  hoverPreviewFieldCount: 5,
  animateOpen: true,
  animateClose: true,
  useToJSON: true
};

const JSONPreview = ({ data, className = '' }) => {
  const containerRef = useRef();

  const renderData = useCallback(() => {
    if ( containerRef.current ) {
      containerRef.current.firstElementChild?.remove();

      const formatter = new JSONFormatter(data, 0, jsonFormatterConfig);
      containerRef.current.appendChild(formatter.render());
    }
  }, [ containerRef, data ]);

  useEffect(() => {
    renderData();
  }, [ data ]);

  const classNames = [
    'json-preview',
    className,
  ].join(' ');

  return (
    <div className={classNames} ref={containerRef} />
  )
}

export default JSONPreview;