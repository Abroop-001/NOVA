/**
 * Image optimization utilities for NOVA e-commerce.
 * Automatically injects Cloudinary transformations (f_auto, q_auto, responsive widths)
 * and generates responsive srcSet definitions.
 */

/**
 * Optimizes an image URL using Cloudinary transformations.
 * Adds f_auto (format) and q_auto (quality), and optional width/crop constraints.
 *
 * @param {string} url - Original image URL
 * @param {object} options
 * @param {number} [options.width] - Target width in pixels
 * @param {string} [options.quality='auto'] - Cloudinary quality setting (e.g. 'auto')
 * @param {string} [options.format='auto'] - Cloudinary format setting (e.g. 'auto')
 * @param {string} [options.crop='limit'] - Cloudinary crop mode
 * @returns {string} Optimized URL
 */
export function optimizeCloudinaryUrl(
  url,
  { width, quality = "auto", format = "auto", crop = "limit" } = {}
) {
  if (!url || typeof url !== "string") return url;

  // Handle Cloudinary delivery
  if (url.includes("res.cloudinary.com") && url.includes("/image/upload/")) {
    const [prefix, rest] = url.split("/image/upload/");
    if (!rest) return url;

    const transforms = [];
    if (format) transforms.push(`f_${format}`);
    if (quality) transforms.push(`q_${quality}`);
    if (width) {
      transforms.push(`w_${width}`);
      if (crop) transforms.push(`c_${crop}`);
    }

    const transformString = transforms.join(",");

    const segments = rest.split("/");
    const firstSegment = segments[0];

    // Check if the URL already has a transformation segment
    const isTransformSegment =
      firstSegment.includes(",") ||
      /^(f_|q_|w_|c_|h_|dpr_|g_|e_|r_|b_|o_|a_|l_|u_|fl_)/.test(firstSegment);

    if (isTransformSegment) {
      segments[0] = transformString;
      return `${prefix}/image/upload/${segments.join("/")}`;
    }

    return `${prefix}/image/upload/${transformString}/${rest}`;
  }

  // Handle Unsplash images if present
  if (url.includes("images.unsplash.com")) {
    try {
      const parsed = new URL(url);
      if (width) parsed.searchParams.set("w", String(width));
      parsed.searchParams.set("auto", "format");
      parsed.searchParams.set("q", quality === "auto" ? "80" : quality);
      return parsed.toString();
    } catch {
      return url;
    }
  }

  return url;
}

/**
 * Generates an HTML srcSet string for Cloudinary images.
 *
 * @param {string} url - Image URL
 * @param {number[]} [widths=[360, 600, 800]] - Breakpoint widths
 * @returns {string|undefined} srcSet string or undefined if not Cloudinary
 */
export function getCloudinarySrcSet(url, widths = [360, 600, 800]) {
  if (!url || typeof url !== "string" || !url.includes("res.cloudinary.com")) {
    return undefined;
  }

  return widths
    .map((w) => `${optimizeCloudinaryUrl(url, { width: w })} ${w}w`)
    .join(", ");
}
