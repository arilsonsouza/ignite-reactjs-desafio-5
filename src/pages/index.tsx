import { GetStaticProps } from 'next';
import Header from '../components/Header';
import { PostInfo } from '../components/PostInfo';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home() {
  return (
    <div className={commonStyles.container}>
      <div className={commonStyles.content}>
        <Header />

        <div className={styles.posts}>
          <a href="#">
            <strong>Como utilizar Hooks</strong>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div className={commonStyles.postInfo}>
              <PostInfo publicationDate='2021-10-17 19:16:49.133587Z' author='Joseph Oliveira' />
            </div>
          </a>

          <a href="#">
            <strong>Como utilizar Hooks</strong>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div className={commonStyles.postInfo}>
              <PostInfo publicationDate='2021-10-17 19:16:49.133587Z' author='Joseph Oliveira' />
            </div>
          </a>

          <a href="#">
            <strong>Como utilizar Hooks</strong>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div className={commonStyles.postInfo}>
              <PostInfo publicationDate='2021-10-17 19:16:49.133587Z' author='Joseph Oliveira' />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
