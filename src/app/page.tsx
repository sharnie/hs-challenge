import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <a href="http://localhost:3000/api/v1/sessions">See all sessions</a>
    </main>
  );
}
