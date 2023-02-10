import React from 'react';

export class ImageGallery extends React.Component {
  render() {
    const { id, webformatURL, largeImageURL, tags } = this.props;
    return (
      <li key={id} className="gallery-item">
        <a href={largeImageURL}>
          <img
            className="gallery__image"
            src={webformatURL}
            alt={tags}
            loading="lazy"
          />
        </a>
      </li>
    );
  }
}
