import Head from 'next/head'
import Header from '../components/Header'
import AddFile from '../components/home-page/AddFile'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
    <Head>
      <title>are you taking</title>
    </Head>

    <Header text="are you taking"/>
    <p style={{textAlign: "center", marginBottom: "3em"}}>Choose any .ics file and compare your schedule with other students</p>
    <AddFile />

    <Footer />

    </>
  )
}
