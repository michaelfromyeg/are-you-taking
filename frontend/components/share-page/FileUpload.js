import styles from './FileUpload.module.scss'
import { Formik, ErrorMessage, Form } from 'formik'
import { useRouter } from 'next/router'
import { Button, Row, Col} from 'react-bootstrap'
import { useState } from 'react'

const FileUpload = ({ id }) => {
	const [name, setName] = useState('')
	const router = useRouter()
	
	return (<Formik
		initialValues={{ calendar: [] }}
		onSubmit={async (values, props) => {
			try {
				console.log('Submitting')

				const baseUrl = process.env.API_URL || "http://localhost:8080"
				console.log('api url', baseUrl)

				// Get the calendar ID for redirect
				const calendarId = id

				const userForm = new FormData();
				userForm.append('label', name)
				userForm.append('calendar_id', calendarId)
				const user = await fetch(`${baseUrl}/user`, { method: 'POST', body: userForm })
				const userBody = await user.json()
				console.log('userBody', userBody)

				const formData = new FormData();
				formData.append('file', values.calendar[0])
				formData.append('user_id', userBody.id)
				const response = await fetch(`${baseUrl}/calendar/${calendarId}/upload`, {
					method: 'POST',
					body: formData
				});

				const responseBody = await response.json()
				console.log(responseBody)

				// Redirect the user to BASE_URL/{calendar_id}
				router.push(`/calendar/${calendarId}`)
			} catch (error) {
				console.error(error)
			}
		}}
	>
		{(formik) => {
			return (
				<Form className={`${styles.form} container-md`}>
					<Row className="g-3">
						<Col md={6}>
							<label className={styles.label}>Name: </label>
							<input className="form-control" value={name} type="text" onChange={event => setName(event.target.value)} required></input>
						</Col>
						<Col md={6}>
							<label className={styles.label} htmlFor="file">Upload my .ics calendar file:</label>
							<input className="form-control" id="file" name="calendar" type="file" onChange={event => {
								const files = event.target.files;
								let myFiles = Array.from(files);
								formik.setFieldValue("calendar", myFiles);
							}} required/>
						</Col>

						<Col md={12}>
							<Button className={styles.submit} type="submit" disabled={formik.isSubmitting}>
								Add another calendar!
							</Button>
						</Col>
						
					</Row>
					<ErrorMessage name="calendar" />
				</Form>
			)
		}}
	</Formik>)
}

export default FileUpload