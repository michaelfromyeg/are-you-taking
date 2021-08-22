import styles from './Share.module.scss'

const Share = ({ url }) => {
	return (
		<div className={styles.share}>
			<a href="fb-messenger://share/?link= https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fsharing%2Freference%2Fsend-dialog&app_id=123456789">Send In Messenger</a>
		</div>
	)
}

export default Share
