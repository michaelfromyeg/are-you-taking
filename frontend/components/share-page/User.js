import { useState } from 'react'
import styles from './User.module.scss'

const User = ({ user, onChange }) => {
	console.log('r', user)
	const [checked, setChecked] = useState(true);

	const handleCheckBoxChange = event => {
		setChecked(event.target.checked)
		onChange(user)
	}

	return (
		<li className={styles.user}>
			<span className={styles.userCol} style={{ backgroundColor: user.colour }}></span>
			<input type="checkbox" checked={checked} onChange={handleCheckBoxChange}></input>
			<label style={{ fontSize: 12, display: 'inline-block', marginLeft: 5 }}>{`${user.label} `}</label>
		</li>
	)
}

export default User
