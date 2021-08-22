import { useState } from 'react'
import styles from './User.module.scss'

const User = ({ user, onChange }) => {
	const [checked, setChecked] = useState(true);

	const handleCheckBoxChange = event => {
		setChecked(event.target.checked)
		onChange(user)
	}

	return (
		<li className={styles.user}>
			<span className={styles.userCol} style={{backgroundColor: user.colour}}></span>
			<label>{user.name}</label>
			<input type="checkbox" checked={checked} onChange={handleCheckBoxChange}></input>
		</li>
	)
}

export default User
