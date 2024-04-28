import data from '../assets/data.json';

const NoDomain = () => {
    return (
        <>
            <section className="section section-header text-dark " style={{ backgroundColor: 'white' }}>
                <div className="container mb-3">
                    <div className="row justify-content-center" style={{ marginBottom: "100px" }} >
                        <div className="col-12 col-md-10 text-center ">
                            <h1 className="display-2 font-weight-bolder ">
                                Simple & Reliable.
                            </h1>
                            <p className="lead  mb-lg-5">CPYPST helps you share important data securly <br />with custom domain with private and public access.</p>
                        </div>
                        <div className="col-12 col-md-10  justify-content-center">
                            <img className="d-none d-md-inline-block" src="./assets/img/scene.svg" alt="Mobile App Mockup" />
                        </div>
                    </div>
                </div>
                <div className="container mb-5">
                    <div className="row mb-5">
                        {data.features.map((e, i) => (
                            <div key={i} className="col-12 col-md-6 col-lg-4 mb-4 mb-lg-0">
                                <div className="card border-0 bg-white text-center p-1">
                                    <div className="card-header bg-white border-0 pb-0">
                                        <div className="icon icon-lg icon-primary mb-4">
                                            <span className={`fas ${e.icon}`}></span>
                                        </div>
                                        <h2 className="h3 text-dark m-0">{e.title}</h2>
                                    </div>
                                    <div className="card-body">
                                        <p>
                                            {e.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="container " >
                    <div className="row justify-content-center mb-5 mb-lg-7">
                        <div className="col-12 col-lg-8 text-center">
                            <h2 className="h1 mb-4">Better in every way</h2>
                            <p className="lead"></p>
                        </div>
                    </div>
                    <div className="row row-grid align-items-center mb-5 mb-lg-7" >
                        <div className="col-12 col-lg-5" style={{ marginBottom: "100px" }}>
                            <h2 className="mb-4">A thoughtful way Share</h2>
                            <p>Simply put, the app remembers your vital info and allows you to share it at any moment. And everything is secured, allowing you to distribute safely.</p>
                            <p>Now you may forget about sharing stuff with others via chat app or email; instead, give a QR code to anyone or tell them your subdomain verbally and you're done!!.</p>

                        </div>
                        <div className="col-12 col-lg-6 ml-lg-auto">
                            <img src="./assets/img/scene-3.svg" className="w-100" alt="" />
                        </div>
                    </div>
                    <div className="row row-grid align-items-center mb-5 mb-lg-7">
                        <div className="col-12 col-lg-5 order-lg-2">
                            <h2 className="mb-4">Get it. Don't sweat it.</h2>
                            <p>We create a unique QR code for your each subdomain you create, you can scan it to get your data on other devices for easy access.</p>
                            <p></p>

                        </div>
                        <div className="col-12 col-lg-6 mr-lg-auto">
                            <img src="./assets/img/scene-2.svg" className="w-100" alt="" />
                        </div>
                    </div>
                    <div className="row">
                        {data.about.map((e, i) => (
                            <div key={i} className="col-12 col-md-6 col-lg-4 mb-4">
                                <div className="card border-light p-4">
                                    <div className="card-body">
                                        <h2 className="display-2 mb-2">{e.title}</h2>
                                        <span>{e.description}</span>
                                    </div>
                                </div>
                            </div>))}
                    </div>
                </div>
            </section>
        </>
    );
}

export default NoDomain;