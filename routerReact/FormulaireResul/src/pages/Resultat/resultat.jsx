import { useLocation } from 'react-router-dom';

function Resultat() {
    const location = useLocation();
    const { formData } = location.state || {};

    if (!formData) {
        return <div>Aucune donnée disponible</div>;
    }

    return (
        <div className="resultat-container">
            <h1>Bonjour !</h1>
            <p>
                Vous êtes {formData.nom} {formData.prenom} et vous êtes en classe de {formData.class}
            </p>
        </div>
    );
}

export default Resultat;



