export const previewStyles = (preview: { bounds: DOMRect }) => ({
    position: "fixed",
    pointerEvents: "none",
    willChange: "transform",
    zIndex: 1000,
    top: 0,
    left: 0,
    transform: `translate(${preview.bounds.left}px, ${preview.bounds.top}px)`    
});