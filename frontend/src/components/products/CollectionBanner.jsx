const CollectionBanner = ({
  bannerImage,
  mobileBannerImage,
  heading = "COLLECTION",
}) => {
  return (
    <section className="w-full overflow-hidden">
      <picture>
        {mobileBannerImage && (
          <source
            media="(max-width: 639px)"
            srcSet={mobileBannerImage}
          />
        )}
        <img
          src={bannerImage}
          alt={heading}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="block w-full h-[300px] sm:h-[320px] lg:h-[550px] object-cover"
        />
      </picture>
    </section>
  );
};

export default CollectionBanner;