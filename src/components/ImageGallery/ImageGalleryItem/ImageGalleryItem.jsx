import React, { Component } from 'react';
import PropTypes from 'prop-types';
import css from './ImageGalleryItem.module.css';
export class ImageGalleryItem extends Component {
  handleModalOpen = () => {
    const { largeImageURL, tags } = this.props;
    this.props.onClick(largeImageURL, tags);
  };
  render() {
    const { id, webformatURL, tags } = this.props;
    return (
      <li key={id} className={css.galleryItem}>
        <img
          className={css['galleryItem-image']}
          src={webformatURL}
          alt={tags}
          loading="lazy"
          onClick={this.handleModalOpen}
        />
      </li>
    );
  }
}
ImageGalleryItem.propTypes = {
  id: PropTypes.number,
  largeImageURL: PropTypes.string,
  webformatURL: PropTypes.string,
  onClick: PropTypes.func,
  tags: PropTypes.string,
};
