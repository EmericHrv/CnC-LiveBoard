import React, { useState, useEffect } from 'react';
import { fetchClubsData } from '../../services/dataService';
import ErrorPage from '../ErrorPage/ErrorPage';
import ClubPage from '../ClubPage/ClubPage';
import InfosPage from '../InfosPage/InfosPage';

const MainPage = () => {
    const [pagesData, setPagesData] = useState([]); // Données des clubs
    const [currentIndex, setCurrentIndex] = useState(0); // Index de la page Club actuelle
    const [showInfoPage, setShowInfoPage] = useState(false); // Indique si InfosPage doit être affichée
    const [error, setError] = useState(null);

    useEffect(() => {
        // Chargement des données des clubs au démarrage
        const loadData = async () => {
            try {
                console.log('Fetching clubs data...');
                const data = await fetchClubsData();
                console.log('Fetched data:', data);
                setPagesData(data);
                setError(null);
            } catch (error) {
                console.error('Error fetching data:', error);
                if (error.response) {
                    setError(`Erreur ${error.response.status}: ${error.response.data}`);
                } else if (error.request) {
                    setError('Erreur réseau. Vérifiez votre connexion.');
                } else {
                    setError('Erreur inconnue.');
                }
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        // Gestion de l'affichage des pages Club et Infos
        if (pagesData.length > 0) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) => {
                    // Si on a affiché toutes les pages Club, passer à InfosPage
                    if (prevIndex === pagesData.length - 1) {
                        setShowInfoPage(true);
                        return 0; // Réinitialiser à la première page Club après InfosPage
                    }
                    return prevIndex + 1; // Passer à la page Club suivante
                });
            }, 60000); // 60 secondes par page Club

            return () => clearInterval(interval);
        }
    }, [pagesData]);

    useEffect(() => {
        // Temporisation pour afficher InfosPage pendant 45 secondes
        if (showInfoPage) {
            const timeout = setTimeout(() => {
                setShowInfoPage(false); // Retour à ClubPage après 45 secondes
            }, 45000);

            return () => clearTimeout(timeout);
        }
    }, [showInfoPage]);

    if (error) {
        return <ErrorPage message={error} />;
    }

    if (pagesData.length === 0) {
        return <p>Chargement des données...</p>;
    }

    return showInfoPage ? <InfosPage /> : <ClubPage club={pagesData[currentIndex]} />;
};

export default MainPage;
