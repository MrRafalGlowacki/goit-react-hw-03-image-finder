import React from 'react';
import Notiflix from 'notiflix';
import css from './App.module.css';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Searchbar } from './Searchbar/Searchbar';

const safeSearch = false;
const amount = 12;
const THEKEY = '31673863-7b4e2329a784886b2ded53b03&';
const getUrl = (search, page) =>
  `https://pixabay.com/api/?key=${THEKEY}&q=${search}&type=photo&orientation=horizontal&safesearch=${safeSearch}&per_page=${amount}&page=${page}`;

export class App extends React.Component {
  state = {
    pictures: [],
    fetchingImages: false,
    actualSearch: '',
    totalHits: -1,
    page: 1,
    totalPages: -1,
  };

  handleFetchPictures = async value => {
    const parsedName = value.trim();
    if (parsedName.length === 0) return;
    const url = getUrl(parsedName, this.state.page);
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
      this.setState({ totalHits: data.totalHits }, () => {
        if (this.state.totalHits === 0) return;
        const pictures = data.hits.map(picture => ({
          id: picture.id,
          webformatURL: picture.webformatURL,
          largeImageURL: picture.largeImageURL,
          tags: picture.tags,
        }));
        const newPictures = [...this.state.pictures, ...pictures];
        this.setState({ pictures: newPictures });
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  };
  handleScrollPage = cardHeight => {
    window.scrollBy({ top: cardHeight * 3, behavior: 'smooth' });
  };

  handleSubmit = (event, value) => {
    event.preventDefault();
    this.setState(
      { actualSearch: value, pictures: [], totalHits: 0, page: 1 },
      async () => {
        const data = await this.handleFetchPictures(value);
        this.setState({ totalHits: data.totalHits }, () => {
          const { totalHits } = this.state;
          if (totalHits === 0) return;
          const totalPagesAmount = Math.ceil(totalHits / amount);
          this.setState({ totalPages: totalPagesAmount });
          Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        });
      }
    );
  };

  handlePaginationLoader = () => {
    const { actualSearch, page, totalPages } = this.state;
    if (page < totalPages) {
      this.setState(
        prevState => ({ page: prevState.page + 1 }),
        () => {
          this.handleFetchPictures(actualSearch);
        }
      );
    }
  };

  render() {
    return (
      <div className={css.app}>
        <Searchbar onSubmit={this.handleSubmit} />
        {this.state.fetchingImages && <Loader />}
        {this.state.pictures.length > 0 && (
          <ImageGallery
            pictures={this.state.pictures}
            page={this.state.page}
            totalPages={this.state.totalPages}
            onButtonClick={this.handlePaginationLoader}
            onScroll={this.handleScrollPage}
          />
        )}
      </div>
    );
  }
}
