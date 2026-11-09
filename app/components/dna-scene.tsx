import { useEffect, useRef } from "react";

/**
 * WebGL double helix for the landing hero. three.js is loaded with a dynamic
 * import so it stays out of the server build and the initial client bundle.
 */
export function DnaScene({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let teardown = () => {};

    import("./dna-scene-webgl")
      .then(({ mountScene }) => {
        if (!disposed) teardown = mountScene(host);
      })
      .catch(() => {
        // No WebGL / failed chunk: the CSS backdrop is the fallback.
      });

    return () => {
      disposed = true;
      teardown();
    };
  }, []);

  return <div ref={hostRef} aria-hidden="true" className={className} />;
}
