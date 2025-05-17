import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './DashboardHeader.css';

const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Événements', href: '/events' },
    { name: 'Postes', href: '/posts' },
];

const DashboardHeader = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <header className="dashboard-header">
            <div className="header-content">
                <div className="logo-container">
                    <img src={logo} alt="ES Morannes" className="logo" />
                    <h1 className="logo-title">LiveBoard</h1>
                </div>

                <button
                    className="burger-menu"
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    aria-label="Ouvrir le menu"
                >
                    ☰
                </button>

                <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
                    <ul className="nav-list">
                        {navigation.map((item) => (
                            <li key={item.name} className="nav-item">
                                <NavLink
                                    to={item.href}
                                    className={({ isActive }) =>
                                        `nav-link ${isActive ? 'active' : ''}`
                                    }
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </NavLink>
                            </li>
                        ))}
                        <li className="nav-item logout-item">
                            <button onClick={handleLogout} className="logout-button">
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
