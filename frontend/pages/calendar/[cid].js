import MainContainer from '../../components/share-page/MainContainer'
import Header from '../../components/Header'
import { Formik, Form, ErrorMessage } from 'formik'
import Share from '../../components/share-page/Share'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Button from 'react-bootstrap/Button'

const SharedCalendarPage = ({ id }) => {
	const [calendar, setCalendar] = useState({
		events: [],
		users: [],
		label: 'Loading...',
	})
	const [loading, setLoading] = useState(true)

	const baseUrl = process.env.API_URL || "http://localhost:8080"

	useEffect(() => {
		const fetchCalendar = async () => {
			try {
				console.log('id', id)
				const response = await fetch(`${baseUrl}/calendar/${id}`)
				const responseBody = await response.json()
				console.log(responseBody)
				setCalendar(responseBody)
			} catch (error) {
				console.error(error)
			} finally {
				setLoading(false)
			}
		}

		fetchCalendar()
	}, [])

	return (
		<div>
			<Header text="share calendar" />
			<Share url={`${baseUrl}/${id}`} />
			<FileUpload id={id} />
			<MainContainer calendar={calendar} loading={loading} />
		</div>
	)
}

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
				<Form style={{ margin: '0 auto', width: '50%' }}>
					<label style={{ marginRight: 10 }}>Name: </label>
					<input style={{ marginRight: 20 }} value={name} type="text" onChange={event => setName(event.target.value)}></input>
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
					<ErrorMessage name="calendar" />
					<Button type="submit" disabled={formik.isSubmitting}>
						Add another calendar!
					</Button>
				</Form>
			)
		}}
	</Formik>)
}

export default SharedCalendarPage

export async function getServerSideProps(context) {
	return {
		props: {
			id: context.params.cid
		},
	}
}
