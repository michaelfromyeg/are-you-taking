import MainContainer from '../components/share-page/MainContainer'
import Header from '../components/Header'
import Share from '../components/share-page/Share'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

const SharedCalendarPage = () => {
	const router = useRouter()
	const [calendar, setCalendar] = useState('')
	
	useEffect(() => {
		fetch('url')
			.then(resp => setCalendar(resp))
		
	}, [])

	const { id } = router.query


	return (
		<div>
			<Header text="share calendar"/>
			<Share url={'URL/' + id}/>
			<MainContainer />
		</div>
	)
}

export default SharedCalendarPage
