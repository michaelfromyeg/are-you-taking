import styles from './Share.module.scss'

const Share = ({ url }) => {
	return (
		<div className={styles.share}>
			<a href={`fb-messenger://share/?link=${url}&app_id=123456789`}>Send via Facebook</a>
		</div>
	)
}

export default Share
