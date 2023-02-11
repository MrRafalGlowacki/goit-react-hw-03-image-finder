import React from 'react';
import PropTypes from 'prop-types';
import css from './ImageGallery.module.css';
import { ImageGalleryItem } from './ImageGalleryItem/ImageGalleryItem';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';

export class ImageGallery extends React.Component {
  state = {
    isModalOpen: false,
    selectedImage: '',
    selectedTags: '',
  };

  galleryRef = React.createRef();

  componentDidUpdate() {
    const cardHeight =
      this.galleryRef.current.firstElementChild.getBoundingClientRect().height;
    this.props.onScroll(cardHeight);
  }
  handleModalOpen = (largeImageURL, tags) => {
    this.setState({
      isModalOpen: true,
      selectedImage: largeImageURL,
      selectedTags: tags,
    });
  };
  handleModalClose = () => {
    this.setState({
      isModalOpen: false,
    });
  };
  render() {
    const { pictures, page, totalPages, onButtonClick } = this.props;
    const { selectedImage, tags, isModalOpen } = this.state;
    const imagesList = pictures.map(pic => (
      <ImageGalleryItem
        key={pic.id}
        id={pic.id}
        webformatURL={pic.webformatURL}
        largeImageURL={pic.largeImageURL}
        tags={pic.tags}
        onClick={this.handleModalOpen}
      />
    ));

    return (
      <>
        <ul className={css.gallery} ref={this.galleryRef}>
          {imagesList}
        </ul>
        {isModalOpen && (
          <Modal
            src={selectedImage}
            tags={tags}
            onClick={this.handleModalClose}
          />
        )}
        {page < totalPages && <Button onClick={onButtonClick} />}
      </>
    );
  }
}

ImageGallery.propTypes = {
  pictures: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      webformatURL: PropTypes.string,
      largeImageURL: PropTypes.string,
    })
  ),
  page: PropTypes.number,
  onScroll: PropTypes.func,
  totalPages: PropTypes.number,
  onButtonClick: PropTypes.func,
};
