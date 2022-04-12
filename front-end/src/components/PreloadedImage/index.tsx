import { LegacyRef, useCallback, useEffect, useRef, useState } from "react";
import './styles.module.scss';

const placeholderSrc = "/images/loading.png";

const PreloadedImage = ({
  src = "",
  className,
  manualLoading = false,
  loaded = false,
  alt = "",
}: PreloadedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(manualLoading ? loaded : false);
  const elementRef = useRef<HTMLDivElement>();

  const classNames = [
    "preloaded-image",
    className,
    !isLoaded ? "preloaded-image--loading" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const onImageLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const onIntersect = useCallback<IntersectionObserverCallback>(
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        const img = new window.Image();

        img.onload = onImageLoad;
        img.src = src;
      }
    },
    [src, onImageLoad]
  );

  useEffect(() => {
    if (!manualLoading && elementRef.current) {
      const observer = new window.IntersectionObserver(onIntersect);
      observer.observe(elementRef.current);
    }
  }, [manualLoading, onIntersect]);

  return (
    <div className={classNames} ref={elementRef as LegacyRef<HTMLDivElement>}>
      <img src={isLoaded ? src : placeholderSrc} alt={alt} />
    </div>
  );
};

export default PreloadedImage;
