import styles from "./Share.module.scss";

const Share = ({ url }) => {
  return (
    <div className={styles.share}>
      <a className={styles.shareLink}>Send via Facebook</a>
    </div>
  );
};

export default Share;
