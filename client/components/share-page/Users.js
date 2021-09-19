import styles from "./Users.module.scss";
import User from "./User";

const Users = ({ users, onChange }) => {
  console.log("u", users);
  return (
    <ul className={styles.users}>
      {users.map((user, index) => (
        <User key={index} user={user} onChange={onChange} />
      ))}
    </ul>
  );
};

export default Users;
