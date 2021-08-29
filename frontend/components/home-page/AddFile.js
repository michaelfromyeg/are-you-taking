import styles from './AddFile.module.scss'
import { Formik, ErrorMessage, Form } from 'formik'
import { useRouter } from 'next/router'
import { Button, Container } from 'react-bootstrap'
import { useState } from 'react'

const AddFile = () => {
	const [name, setName] = useState('')
	const router = useRouter()

	return (
		<Formik
			initialValues={{ calendar: [] }}
			onSubmit={async (values, props) => {
				try {
					const baseUrl = process.env.API_URL || "http://localhost:8080"
					console.log('api url', baseUrl)

					// Create the calendar
					const calendar = await fetch(`${baseUrl}/calendar`, { method: 'POST' })
					const calendarBody = await calendar.json()
					console.log('calendarBody', calendarBody)

					// Get the calendar ID for redirect
					const calendarId = calendarBody.id

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
	
						<div className="row g-3">
							<div className="col-md-6">
								<label className={styles.label} htmlFor="name">Name: </label>
								<input className="form-control" id="name" placeholder="name" value={name} type="text" onChange={event => setName(event.target.value)} required/>
							</div>
							<div className="col-md-6">
								<label className={styles.label} htmlFor="file">Upload my .ics calendar file:</label>
								<input className="form-control" id="file" name="calendar" type="file" onChange={event => {
									const files = event.target.files;
									let myFiles = Array.from(files);
									formik.setFieldValue("calendar", myFiles);
								}} required/>
							</div>
							<div className="col-md-1">
								<Button className={styles.submit} type="submit" disabled={formik.isSubmitting}>Submit</Button>
							</div>
						</div>
						
						<ErrorMessage name="calendar" />
					</Form>
				)
			}}
		</Formik>
	)
}

export default AddFile


