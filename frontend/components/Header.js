import styles from "./Header.module.scss";

const Header = ({ text }) => {
  return <div className={styles.header}>{text}</div>;
};

export default Header;
