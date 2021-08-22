import styles from './AddFile.module.scss'
import { Formik, Form, ErrorMessage } from 'formik'
import { useRouter } from 'next/router'
import Button from 'react-bootstrap/Button'
import { useState } from 'react'

const AddFile = () => {
	const [name, setName] = useState('')
	const router = useRouter()

	return (
		<>
		<Formik
			initialValues={{ calendar: [] }}
			onSubmit={async (values, props) => {
				try {
					const baseUrl = process.env.API_URL || "http://localhost:8080"
					console.log('api url', baseUrl)

					// Create the calendar
					const create = await fetch(`${baseUrl}/calendar`, { method: 'POST' })
					const createBody = await create.json()
					console.log('createBody', createBody)

					// Get the calendar ID for redirect
					const calendarId = createBody.id

					let data = new FormData();
					data.append('file', values.calendar[0])
					const response = await fetch(`${baseUrl}/calendar/${calendarId}/upload`, {
						method: 'POST',
						headers: {
							'Content-Type': 'multipart/form-data'
						},
						body: data
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
					<Form className={styles.form}>
						<label className={styles.label}>Name: </label>
						<input className={styles.name} type="text" value={name} onChange={event => setName(event.target.value)}></input>
						<input
							className={styles.file}
							id="file"
							name="calendar"
							type="file"
							onChange={(event) => {
								const files = event.target.files;
								let myFiles = Array.from(files);
								formik.setFieldValue("calendar", myFiles);
							}}
						/>
						<ErrorMessage name="calendar" />
						<Button className={styles.submit} type="submit" disabled={formik.isSubmitting}>
							Submit
						</Button>

					</Form>
				)
			}}
		</Formik>
		
		</>
	)
}

export default AddFile


