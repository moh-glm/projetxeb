import React from 'react';

function SkeletonCard() {
  return (
    <div className="skel-card">
      <div className="skel-img" />
      <div className="skel-body">
        <div className="skel-line sm" />
        <div className="skel-line md" />
        <div className="skel-line lg" />
        <div className="skel-line sm" />
      </div>
    </div>
  );
}

export default SkeletonCard;
