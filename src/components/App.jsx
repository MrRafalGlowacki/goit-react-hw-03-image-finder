import React from 'react';
import Notiflix from 'notiflix';
import { ImageGallery } from './ImageGallery/ImageGallery';
import Loader from './ImageGallery/Loader/Loader';
import { Searchbar } from './Searchbar/Searchbar';
const THEKEY = '31673863-7b4e2329a784886b2ded53b03&';
const safeSearch = false;
let totalHits = 0;
let page = 1;
let amount = 12;
let totalPages = 1;
const getUrl = search =>
  `https://pixabay.com/api/?key=${THEKEY}&q=${search}&type=photo&orientation=horizontal&safesearch=${safeSearch}&per_page=${amount}&page=${page}`;

export class App extends React.Component {
  state = {
    pictures: [],
    fetchingImages: false,
    actualSearch: '',
  };
  handleFetchPictures = async value => {
    const parsedName = value.trim();
    if (parsedName.length === 0) return;
    const url = getUrl(parsedName);
    this.setState({ fetchingImages: true });
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw (
          (new Error(`Fetch failed with status ${response.status}`),
          Notiflix.Notify.failure(
            `Fetch failed with status ${response.status}`
          ))
        );
      }
      const data = await response.json();
      this.setState({ fetchingImages: false });
      if (data.hits.length === 0) {
        throw Notiflix.Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      totalHits = data.totalHits;
      if (totalHits === 0) return;
      const pictures = data.hits.map(picture => ({
        id: picture.id,
        webformatURL: picture.webformatURL,
        largeImageURL: picture.largeImageURL,
        tags: picture.tags,
      }));
      const newPictures = [...this.state.pictures, ...pictures];
      this.setState({ pictures: newPictures });
    } catch (error) {
      console.error(error);
    }
  };
  handleScrollPage = cardHeight => {
    window.scrollBy({ top: cardHeight * 3, behavior: 'smooth' });
  };

  handlePaginationLoader = () => {
    const { actualSearch } = this.state;
    if (page < totalPages) {
      return (page += 1) && this.handleFetchPictures(actualSearch);
    }
  };

  handleSubmit = async (event, value) => {
    event.preventDefault();
    this.setState({ actualSearch: value, pictures: [] });
    page = 1;
    totalHits = 0;
    await this.handleFetchPictures(value);
    if (totalHits === 0) return;
    totalPages = Math.ceil(totalHits / amount);
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  };

  render() {
    return (
      <>
        <Searchbar onSubmit={this.handleSubmit} />
        {this.state.fetchingImages && <Loader />}
        {this.state.pictures.length > 0 && (
          <ImageGallery
            pictures={this.state.pictures}
            page={page}
            totalPages={totalPages}
            onButtonClick={this.handlePaginationLoader}
            onScroll={this.handleScrollPage}
          />
        )}
      </>
    );
  }
}
