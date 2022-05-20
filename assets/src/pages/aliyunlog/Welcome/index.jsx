import React from 'react';
import welImg1 from './welcome_bg1.png';
import welImg2 from './welcome_bg2.png';
import styles from './index.less';

export default class WelcomeView extends React.Component {
  render() {
    const { title = '', mode = 1 } = this.props;
    return (
      <div className={styles.welcome_wrap}>
        <div className={styles.title}>WELCOME</div>
        <div className={styles.subtitle}>{title}</div>
        <img src={mode === 2 ? welImg2 : welImg1} alt={title} />
      </div>
    );
  }
}
