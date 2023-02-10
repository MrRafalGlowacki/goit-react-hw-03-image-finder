import React from 'react';
import css from './Searchbar.module.css';
import { BsSearch } from 'react-icons/bs';

export class Searchbar extends React.Component {
  state = {
    value: '',
  };
  handleChange = event => {
    const { value } = event.target;
    this.setState({ value: value });
  };
  r;
  handleOnSubmit = e => {
    const { onSubmit } = this.props;
    onSubmit(e, this.state.value);
    this.setState({ value: '' });
     };
  render() {
    return (
      <header className={css.searchbar}>
        <form onSubmit={this.handleOnSubmit} className={css.form}>
          <button type="submit" className={css.button}>
            <span className={css.label}>Search</span>
            <BsSearch style={{ verticalAlign: 'middle' }} />
          </button>

          <input
            onChange={this.handleChange}
            className={css.input}
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            name="img"
            value={this.state.value}
            required
          />
        </form>
      </header>
    );
  }
}
