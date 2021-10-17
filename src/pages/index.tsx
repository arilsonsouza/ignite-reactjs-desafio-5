import Link from 'next/link';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';

import { PostInfo } from '../components/PostInfo';

import { getPrismicClient } from '../services/prismic';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { useState } from 'react';
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

export default function Home({ postsPagination }: HomeProps) {
  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);

  function handleLoadMore(): void {
    fetch(nextPage)
      .then(response => response.json())
      .then(postsResponse => {
        setNextPage(postsResponse.next_page);

        const results = postsResponse.results.map(post => {
          return {
            uid: post.uid,
            data: {
              title: post.data.title,
              subtitle: post.data.subtitle,
              author: post.data.author,
            },
            first_publication_date: post.first_publication_date
          }
        });

        setPosts([...posts, ...results]);
      })
  }

  return (
    <>
      <Head>
        <title>Home | Spacetraveling</title>
      </Head>
      <div className={commonStyles.container}>
        <div className={commonStyles.content}>
          <main>
            <div className={styles.posts}>
              {posts.map(post =>
                <Link href={`/post/${post.uid}`} key={post.uid}>
                  <a>
                    <strong>{post.data.title}</strong>
                    <p>{post.data.subtitle}</p>
                    <div className={commonStyles.postInfo}>
                      <PostInfo publicationDate={post.first_publication_date} author={post.data.author} />
                    </div>
                  </a>
                </Link>
              )}
            </div>

            {nextPage && <button
              className={styles.loadMoreBtn}
              type='button'
              onClick={handleLoadMore}>
              Carregar mais posts
            </button>}
          </main>
        </div>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'post')
  ], {
    fetch: ['post.title', 'post.author', 'post.subtitle'],
    pageSize: 20
  });

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
      first_publication_date: post.first_publication_date
    }
  });

  return {
    props: {
      postsPagination: {
        results: posts,
        next_page: postsResponse.next_page
      }
    }
  }
};
