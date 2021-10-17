import styles from './header.module.scss';

export default function Header() {
  return (
    <nav className={styles.container}>
      <img src='/images/logo.svg' alt='Logo' />
    </nav>
  );
}
