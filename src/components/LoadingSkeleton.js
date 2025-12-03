import React from "react";
import "../styles/loading-skeleton.css";

export function RecipeCardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text short"></div>
      </div>
    </div>
  );
}

export function RecipeDetailSkeleton() {
  return (
    <div className="skeleton-detail">
      <div className="skeleton-hero-image"></div>
      <div className="skeleton-header">
        <div className="skeleton-title-large"></div>
        <div className="skeleton-meta"></div>
        <div className="skeleton-text"></div>
      </div>
      <div className="skeleton-body">
        <div className="skeleton-section">
          <div className="skeleton-subtitle"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text"></div>
        </div>
        <div className="skeleton-section">
          <div className="skeleton-subtitle"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text"></div>
        </div>
      </div>
    </div>
  );
}

