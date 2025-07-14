import React, { useState } from "react";

type Vertex = { x: number; y: number };
type Segment = {
    page_index: number;
    vertices: Vertex[];
};

type HighlightBoxProps = {
    segment: Segment;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
};

export default function HighlightBox({ segment, onMouseEnter, onMouseLeave }: HighlightBoxProps) {
    const vertices = segment.vertices;
    const xs = vertices.map(v => v.x);
    const ys = vertices.map(v => v.y);

    const left = Math.min(...xs) / 1.32;
    const top = Math.min(...ys) / 1.35;
    const width = (Math.max(...xs) - Math.min(...xs)) / 1.4;
    const height = (Math.max(...ys) - Math.min(...ys));

    return (
        <div
            className="absolute pointer-events-auto rounded-sm"
            style={{
                top: `${top}px`,
                left: `${left}px`,
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor: "rgba(252, 211, 77, 0.3)",
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
        </div>
    );
}
