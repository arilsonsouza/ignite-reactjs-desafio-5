import Head from 'next/head';
import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router';
import Prismic from '@prismicio/client';
import { GetStaticPaths, GetStaticProps } from 'next';

import { PostInfo } from '../../components/PostInfo';
import { getPrismicClient } from '../../services/prismic';

import styles from './post.module.scss';
import commonStyles from '../../styles/common.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();

  const readTime = post.data.content.reduce((acc, content) => {
    const contentReadTime = RichText.asText(content.body).split(' ').length;
    return Math.ceil(acc + contentReadTime / 200);
  }, 0);

  return (
    <>
      {router.isFallback ? <p>Carregando...</p>
        : <>
          <Head>
            <title>{post.data.title} | Spacetraveling</title>
          </Head>
          <main className={styles.post}>
            <div className={styles.bannerContainer}>
              <img src={post.data.banner.url} alt={post.data.title} />
            </div>

            <div className={commonStyles.container}>
              <div className={commonStyles.content}>
                <h1>{post.data.title}</h1>

                <PostInfo
                  publicationDate={post.first_publication_date}
                  author={post.data.author}
                  readTime={`${readTime} min`}
                />

                <div className={styles.postContent}>
                  {post.data.content.map(content => (
                    <article key={content.heading}>
                      <strong>{content?.heading}</strong>
                      {content.body.map((body, index) => {
                        return <p key={index}>{body.text}</p>
                      })}
                    </article>
                  ))}
                </div>

              </div>
            </div>
          </main>
        </>
      }
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    { fetch: ['post.title', 'post.subtitle', 'post.author'] }
  );

  const slugs = posts.results.map((post => post.uid));

  return {
    paths: slugs.map(slug => ({ params: { slug } })),
    fallback: true
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content.map(content => ({
        heading: content.heading,
        body: content.body.map(body => ({
          text: body.text,
          type: body.type,
          spans: [...body.spans]
        })),
      }))

    },
  };

  return {
    props: {
      post
    },
    revalidate: 3600, // 1 hour
  }
};
