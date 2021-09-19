import { useState, useEffect } from "react";
import Calendar from "./Calendar";
import Users from "./Users";
import styles from "./MainContainer.module.scss";

const MainContainer = ({ calendar, loading }) => {
  const [users, setUsers] = useState(calendar?.users || []);
  const [events, setEvents] = useState(calendar?.events || []);

  useEffect(() => {
    const updateUsers = (newUsers) => {
      setUsers(newUsers);
    };
    updateUsers(calendar.users);
  }, [calendar]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const updateEvents = (newEvents) => {
      setEvents(newEvents);
    };
    updateEvents(calendar.events);
  }, [calendar]); // eslint-disable-line react-hooks/exhaustive-deps

  const onChange = (toggledUser) => {
    setUsers(
      users.map((user) => {
        return user.name === toggledUser.name
          ? { ...user, display: !user.display }
          : user;
      })
    );

    // setEvents(events.filter(event => {
    // 	return event.user_id !== toggledUser.id
    // }))
  };

  if (loading) {
    return (
      <div className={styles.mainContainer}>
        <Calendar events={[]} />
        <Users users={[]} onChange={onChange} />
      </div>
    );
  } else {
    return (
      <div className={styles.mainContainer}>
        <Calendar events={calendar.events || []} />
        <Users users={calendar.users || []} onChange={onChange} />
      </div>
    );
  }
};

export default MainContainer;
