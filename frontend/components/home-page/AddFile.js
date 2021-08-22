import styles from './AddFile.module.scss'
import { Formik, Form, ErrorMessage} from 'formik'
import Router from 'next/router'
import Button from 'react-bootstrap/Button'

const AddFile = () => {
	
	return (
		<Formik 
		initialValues={{ calendar: []}} 
		onSubmit={async (values, props) => {
			let data = new FormData();
			data.append('file', values.calendar[0])
			try {
				const response = await fetch( 'url', {
					method: 'POST',
					headers: {
						'Content-Type': 'multipart/form-data'
					},
				});

				/**
				 * {
				 * 	calendar_id: ...,
				 * 
				 * }
				 */

				const calendar_id = response.calendar_id
				Router.push('/test')
				// Redirect the user to BASE_URL/{calendar_id}
			} catch (error) {
				console.error(error)
			}
		}}
		>
			{(formik) => {
				return (
					<>
					<Form className={styles.form}>
						<input
							id="file"
							name="calendar"
							type="file"
							onChange={(event) => {
								const files = event.target.files;
								let myFiles = Array.from(files);
								formik.setFieldValue("calendar", myFiles);
							}}
							/>
							<ErrorMessage name="calendar"/>
							<Button className={styles.submit} type="submit" disabled={formik.isSubmitting}>
								Submit
							</Button>
					</Form>
					</>
				)
			}}


		</Formik>
	)
}

export default AddFile


