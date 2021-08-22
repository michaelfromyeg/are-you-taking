import styles from './Footer.module.scss'

const Footer = () => {
	return (
		<footer className={styles.footer}>
			<a target="_blank" href="https://github.com/michaelfromyeg">Michael Demarco</a>
			<div>© 2021 are you taking</div>
			<a target="_blank" href="https://github.com/bonvee-99">Ben Vinnick</a>
		</footer>
	)
}

export default Footer
