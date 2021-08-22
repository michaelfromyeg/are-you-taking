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

						const formData = new FormData();
						formData.append('file', values.file[0])

						const response = await fetch(`${baseUrl}/calendar/${calendarId}/upload`, {
							method: 'POST',
							body: formData,
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
						<Form className={styles.form} encType="multipart/form-data">
							<label>Name: </label>
							<input className={styles.name} type="text" value={name} onChange={event => setName(event.target.value)}></input>
							<input
								id="file"
								name="file"
								type="file"
								onChange={(event) => {
									const files = event.target.files;
									const filesArr = Array.from(files);
									formik.setFieldValue("file", filesArr);
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


