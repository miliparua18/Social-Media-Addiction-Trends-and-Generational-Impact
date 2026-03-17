import React from 'react';
import { Link } from 'react-router-dom';
import './Landing_page.css';

// --- MOCK DATA ---
const servicesData = [
    { 
        icon: '📊', 
        title: 'Addiction Prediction', 
        description: 'Uses a Machine Learning model to accurately predict a user’s current level of social media addiction based on in-app behavior.',
        link: '/questionnaire'
    },
    { 
        icon: '📈', 
        title: 'Generational Impact Trends', 
        description: 'Forecasts how addiction trends are likely to evolve in the future for different generational and regional cohorts.',
        link: '/futureprediction'
    },
    { 
        icon: '💡', 
        title: 'Personalized Recommendations', 
        description: 'Provides tailored advice and digital well-being strategies to help users mitigate their predicted addiction risks.',
        link: '/advice'
    },
];

const teamMembers = [
    { id: 1, name: 'Sankar Bhunia', role: 'BWU/BTA/22/144', avatar: '/sankar3.jpg' },
    { id: 2, name: 'Mili Parua', role: 'BWU/BTA/22/131', avatar: '/mili.jpg' },
    { id: 3, name: 'Sayantan Ghosh', role: 'BWU/BTA/22/121', avatar: '/sanu.jpeg' },
];

// -------------------

// --- Services Component ---
const ServicesSection = () => {
    return (
        <section id="services-section" className="services-section">

            <div className="services-header">
                <h2 className="section-title">Our Core Services</h2>
                <p className="section-subtitle">
                    A powerful, ML-driven solution for digital well-being.
                </p>
            </div>
            
            <div className="services-grid">
                {servicesData.map((service, index) => (
                    <div className={`service-card fade-in delay-${index + 1}`} key={service.title}>
                        <div className="service-icon">{service.icon}</div>
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                        <Link to={service.link} className="service-link">
                            Learn More →
                        </Link>
                    </div>
                ))}
            </div>

        </section>
    );
};

// --- Members Component ---
const MembersSection = () => {
    return (
        <section id="members-section" className="members-section">

            <div className="members-header">
                <h2 className="section-title">Meet Our Team</h2>
                <p className="section-subtitle">
                    The dedicated minds behind Social Media Madness.
                </p>
            </div>

            <div className="members-grid">
                {teamMembers.map((member, index) => (
                    <div className={`member-card zoom-in delay-${index + 1}`} key={member.id}>
                        
                        <img
                            src={member.avatar}
                            alt={member.name}
                            className="member-avatar"
                        />

                        <h4>{member.name}</h4>
                        <p className="member-role">{member.role}</p>

                    </div>
                ))}
            </div>

        </section>
    );
};


// --- Header Component ---
const Header = () => {

    const scrollToSection = (id) => {

        const section = document.getElementById(id);

        if(section){
            section.scrollIntoView({
                behavior: "smooth"
            });
        }

    };

    const navLinks = [
        { name: 'About', target: 'hero-section' },
        { name: 'Services', target: 'services-section' },
        { name: 'Contact', target: 'members-section' },
    ];

    return (

        <header className="header">

            <div className="logo">
                <Link to="/">.SMS</Link>
            </div>

            <nav className="nav">

                <ul className="nav-list">

                    {navLinks.map((link) => (

                        <li key={link.name} className="nav-item">

                            <span
                                className="nav-link"
                                onClick={() => scrollToSection(link.target)}
                                style={{cursor:"pointer"}}
                            >
                                {link.name}
                            </span>

                        </li>

                    ))}

                </ul>

                <a href='/questionnaire'>
                    <button className="sign-up-button">
                        Get started
                    </button>
                </a>

            </nav>

        </header>

    );
};


// --- Main Landing Page Component ---
const LandingPage = () => {

    return (

        <div className='landing-page-container'>

            <Header/>

            {/* Hero Section */}
            <div id="hero-section" className="hero-section">

                <div className="top-right-bg-shape"></div>

                <div className="content-wrapper">

                    <div className="hero-text">

                        <h1 className="hero-title">
                            Social Media <span className="dark-madness">Sickness</span>
                        </h1>

                        <p className="hero-subtitle">
                            “Predicting Social Media Addiction Trends and Generational Impact” focuses on designing a Machine Learning (ML)–based web application that predicts a user’s addiction level based on behavioural inputs such as screen time, app usage frequency, engagement patterns, and night-time usage.
                        </p>

                        <Link to="/questionnaire" className="cta-button">
                            Get started!
                        </Link>

                    </div>

                    <div className="hero-graphic">

                        <img
                            src="/Social-Media-Addiction.jpg"
                            alt="Social media addiction illustration"
                            className="hero-image"
                        />

                    </div>

                </div>

            </div>

            {/* Services Section */}
            <ServicesSection />

            {/* Members Section */}
            <MembersSection />

        </div>

    );
};

export default LandingPage;