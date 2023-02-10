import React, { Component } from 'react';
import css from './ImageGalleryItem.module.css';
export class ImageGalleryItem extends Component {
  render() {
    const { id, webformatURL, largeImageURL, tags } = this.props;
    return (
      <li key={id} className={css.galleryItem}>
        <a href={largeImageURL}>
          <img
            className={css['galleryItem-image']}
            src={webformatURL}
            alt={tags}
            loading="lazy"
          />
        </a>
      </li>
    );
  }
}
