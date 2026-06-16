/**
 * Warm ambient background — painted feel, not sci-fi blobs.
 * Three layers: warm colored blobs + subtle dot grid + grain texture.
 */
export function BlobBackground() {
  return (
    <>
      {/* Warm ambient color wash */}
      <div className="warm-backdrop" />

      {/* Soft floating blobs with organic warmth */}
      <div className="blob-field" aria-hidden>
        <div className="blob blob-amber" />
        <div className="blob blob-terracotta" />
        <div className="blob blob-plum" />
      </div>

      {/* Subtle dot grid instead of harsh line grid */}
      <div className="dot-grid" aria-hidden />

      {/* Grain texture for tactile depth */}
      <div className="grain-overlay" aria-hidden />
    </>
  )
}
