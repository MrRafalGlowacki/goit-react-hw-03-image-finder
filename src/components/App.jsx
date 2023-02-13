import React from 'react';
import Notiflix from 'notiflix';
import css from './App.module.css';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Searchbar } from './Searchbar/Searchbar';

export class App extends React.Component {
  state = {
    pictures: [],
    fetchingImages: false,
    THEKEY: '31673863-7b4e2329a784886b2ded53b03&',
    actualSearch: '',
    safeSearch: false,
    totalHits: -1,
    page: 1,
    amount: 12,
    totalPages: -1,
  };
  getUrl = search =>
    `https://pixabay.com/api/?key=${this.state.THEKEY}&q=${search}&type=photo&orientation=horizontal&safesearch=${this.state.safeSearch}&per_page=${this.state.amount}&page=${this.state.page}`;
  handleFetchPictures = async value => {
    const parsedName = value.trim();
    if (parsedName.length === 0) return;
    // const url = this.getUrl(parsedName);
    this.setState({ fetchingImages: true });
    try {
      const response = await fetch(this.getUrl(parsedName));
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
        console.log('handlefetchpictures', this.state.totalHits);
        if (this.state.totalHits === 0) return;
        else {
          const pictures = data.hits.map(picture => ({
            id: picture.id,
            webformatURL: picture.webformatURL,
            largeImageURL: picture.largeImageURL,
            tags: picture.tags,
          }));
          const newPictures = [...this.state.pictures, ...pictures];
          this.setState({ pictures: newPictures });
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
  handleScrollPage = cardHeight => {
    window.scrollBy({ top: cardHeight * 3, behavior: 'smooth' });
  };

  handleSubmit = async (event, value) => {
    event.preventDefault();
    this.setState({ actualSearch: value, pictures: [], totalHits: 0, page: 1 });
    console.log('before', this.state.totalHits);
    await this.handleFetchPictures(value);
    const { totalHits, amount } = this.state;
    console.log('after', totalHits);
    if (totalHits === 0) return;
    const totalPagesAmount = Math.ceil(totalHits / amount);
    this.setState({ totalPages: totalPagesAmount });
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
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
