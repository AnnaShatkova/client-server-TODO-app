import styles from "./Dots.module.scss";

const Dots: React.FC = () => {
  return (
    <div className={styles.loading}>
      <span className={styles.dot}></span>
      <span className={styles.dot}></span>
      <span className={styles.dot}></span>
    </div>
  );
};

export default Dots;
