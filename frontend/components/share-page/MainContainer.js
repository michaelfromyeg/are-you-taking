import { useState, useEffect } from 'react'
import Calendar from './Calendar'
import Users from './Users'
import styles from './MainContainer.module.scss'

const MainContainer = () => {
	const testUsers = [
		{
			name: 'ben',
			colour: 'red',
			events: [],
			display: true
		},
		{
			name: 'demarco',
			colour: 'blue',
			events: [],
			display: true
		},
		{
			name: 'james',
			colour: 'green',
			events: [],
			display: true
		},
		{
			name: 'dave',
			colour: 'orange',
			events: [],
			display: true
		},
		{
			name: 'connor',
			colour: 'violet',
			events: [],
			display: true
		}
	]

	const [users, setUsers] = useState([])

	useEffect(() => {
		setUsers(testUsers)
	}, [])

	const onChange = (toggledUser) => {
		setUsers(users.map(user => {
			return user.name === toggledUser.name ? {...user, display: !user.display} : user
		}))
	}

	return (
		<div className={styles.mainContainer}>
			<Calendar users={users} />
			<Users users={users} onChange={onChange}/>
		</div>
	)
}

export default MainContainer
