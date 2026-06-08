export function WorkGallery({ images }) {
  if (!images?.length) return null;

  return (
    <div className="work-gallery">
      {images.map((src, index) => (
        <figure className="work-gallery__item" key={`${src}-${index}`}>
          <img src={src} alt="" loading="lazy" />
        </figure>
      ))}
    </div>
  );
}
