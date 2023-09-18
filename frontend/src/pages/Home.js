import './pages.css'

export const Home = () => {
    return(
        <div>
            <div className="title">
                <h1>Home page</h1>
            </div>
            <p className='intro'>
                Welcome to our Forex trading assistant. We are a free-to-use software that provides Forex data from various sources.<br></br>

                Our goal is to provide a collection of information from a variety of sources, that allows for traders to make valuable insights into the 
                Forex market.
            </p>
            <p className='disclaimer'>
                This data presented is not market trading advice.
            </p>
        </div>
    )
}