import React from 'react';
import css from './Modal.module.css';

export class Modal extends React.Component {
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }
  handleKeyDown = event => {
    if (event.key === 'Escape') {
      this.props.onClick();
    }
  };
  render() {
    const { src, tags, onClick } = this.props;
    return (
      <div className={css.overlay} onClick={onClick}>
        <div className={css.modal}>
          <img src={src} alt={tags} />
        </div>
      </div>
    );
  }
}
