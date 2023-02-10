import React from 'react';
import css from './ImageGallery.module.css';
import { ImageGalleryItem } from './ImageGalleryItem/ImageGalleryItem';

export class ImageGallery extends React.Component {
  render() {
    const imagesList = this.props.pictures.map(pic => (
        <ImageGalleryItem
          key={pic.id}
          id={pic.id}
          webformatURL={pic.webformatURL}
          largeImageURL={pic.largeImageURL}
          tags={pic.tags}
        />
      ));
    
    return (
      <ul className={css.gallery}>
        {imagesList}
      </ul>
    );
  }
}
