import MainContainer from '../../components/share-page/MainContainer'
import Header from '../../components/Header'
import Share from '../../components/share-page/Share'
import { useState, useEffect } from 'react'

const SharedCalendarPage = ({ id }) => {

	const [calendar, setCalendar] = useState({})
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
			<MainContainer calendar={calendar} loading={loading} />
		</div>
	)
}

export default SharedCalendarPage

export async function getServerSideProps(context) {
	return {
		props: {
			id: context.params.cid
		},
	}
}
