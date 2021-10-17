import { AppProps } from 'next/app';
import Header from '../components/Header';

import '../styles/globals.scss';
import commonStyles from '../styles/common.module.scss';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <div className={commonStyles.container}>
      <div className={commonStyles.content}>
        <Header />
        <Component {...pageProps} />
      </div>
    </div>
  )
}

export default MyApp;
