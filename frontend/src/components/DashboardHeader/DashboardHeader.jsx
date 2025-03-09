import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './DashboardHeader.css';

const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Événements', href: '/events' },
    { name: 'Postes', href: '/posts' },
];

const DashboardHeader = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="dashboard-header">
            <div className="header-content">
                <div className="logo-container">
                    <img src={logo} alt="ES Morannes" className="logo" />
                    <h1 className="logo-title">LiveBoard</h1>
                </div>
                <button className="burger-menu" onClick={toggleMenu}>
                    ☰
                </button>
                <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
                    <ul className="nav-list">
                        {navigation.map((item) => (
                            <li key={item.name} className="nav-item">
                                <a
                                    href={item.href}
                                    className={`nav-link ${location.pathname === item.href ? 'active' : ''}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </a>
                            </li>
                        ))}
                        <li className="nav-item">
                            <button onClick={handleLogout} className="logout-button-mobile">
                                Déconnexion
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default DashboardHeader;
