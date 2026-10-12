import { Navigate, Route, Routes } from 'react-router-dom';
import { useApp } from './contexte.jsx';
import { configOk } from './supabase';
import Layout from './components/Layout.jsx';
import Connexion from './pages/Connexion.jsx';
import TableauBord from './pages/TableauBord.jsx';
import Parametrage from './pages/Parametrage.jsx';
import Secteurs from './pages/Secteurs.jsx';
import Ecoles from './pages/Ecoles.jsx';
import EcoleDetail from './pages/EcoleDetail.jsx';
import Personnel from './pages/Personnel.jsx';
import Eleves from './pages/Eleves.jsx';
import Compositions from './pages/Compositions.jsx';
import SaisieNotes from './pages/SaisieNotes.jsx';
import BilanAnnuel from './pages/BilanAnnuel.jsx';
import Releves from './pages/Releves.jsx';
import Statistiques from './pages/Statistiques.jsx';
import SuiviSaisie from './pages/SuiviSaisie.jsx';
import CartesScolaires from './pages/CartesScolaires.jsx';
import FichesEPS from './pages/FichesEPS.jsx';
import CEPE from './pages/CEPE.jsx';
import Importer from './pages/Importer.jsx';
import Comptes from './pages/Comptes.jsx';

const TOUS = ['superviseur', 'iepp', 'conseiller', 'directeur', 'saisie'];
const GESTION = ['superviseur', 'iepp'];
const CIRC = ['superviseur', 'iepp', 'conseiller'];

export const MENU = [
  { chemin: '/', titre: 'Tableau de bord', roles: TOUS, el: <TableauBord /> },
  { chemin: '/parametrage', titre: 'Paramétrage circonscription', roles: GESTION, el: <Parametrage /> },
  { chemin: '/secteurs', titre: 'Secteurs pédagogiques', roles: CIRC, el: <Secteurs /> },
  { chemin: '/ecoles', titre: 'Écoles', roles: TOUS, el: <Ecoles /> },
  { chemin: '/personnel', titre: 'Personnel', roles: CIRC, el: <Personnel /> },
  { chemin: '/eleves', titre: 'Élèves', roles: TOUS, el: <Eleves /> },
  { chemin: '/compositions', titre: 'Compositions', roles: TOUS, el: <Compositions /> },
  { chemin: '/bilan', titre: 'Bilan annuel', roles: TOUS, el: <BilanAnnuel /> },
  { chemin: '/releves', titre: 'Relevés de notes', roles: TOUS, el: <Releves /> },
  { chemin: '/statistiques', titre: 'Statistiques', roles: CIRC, el: <Statistiques /> },
  { chemin: '/suivi-saisie', titre: 'Suivi de la saisie', roles: CIRC, el: <SuiviSaisie /> },
  { chemin: '/cartes', titre: 'Cartes scolaires', roles: TOUS, el: <CartesScolaires /> },
  { chemin: '/eps', titre: 'Fiches EPS', roles: TOUS, el: <FichesEPS /> },
  { chemin: '/cepe', titre: 'Convocations CEPE', roles: TOUS, el: <CEPE /> },
  { chemin: '/importer', titre: 'Importer', roles: ['superviseur', 'iepp', 'directeur', 'saisie'], el: <Importer /> },
  { chemin: '/comptes', titre: 'Comptes utilisateurs', roles: GESTION, el: <Comptes /> },
];

export default function App() {
  const { session, profil, role, chargement, erreurProfil, deconnexion } = useApp();

  if (!configOk) {
    return (
      <div className="ecran-centre">
        <div className="carte" style={{ maxWidth: 520 }}>
          <h2>Configuration manquante</h2>
          <p>Renseignez <code>VITE_SUPABASE_URL</code> et <code>VITE_SUPABASE_ANON_KEY</code> dans les variables d'environnement (fichier <code>.env</code> ou Vercel), puis relancez.</p>
        </div>
      </div>
    );
  }
  if (!session) return <Connexion />;
  if (chargement) return <div className="ecran-centre"><div className="chargeur" /></div>;
  if (!profil) {
    return (
      <div className="ecran-centre">
        <div className="carte" style={{ maxWidth: 480 }}>
          <h2>Accès impossible</h2>
          <p>{erreurProfil}</p>
          <p className="discret">Demandez à votre inspecteur ou au superviseur de vérifier votre compte.</p>
          <button className="btn" onClick={deconnexion}>Se déconnecter</button>
        </div>
      </div>
    );
  }

  const autorises = MENU.filter((m) => m.roles.includes(role));
  return (
    <Layout menu={autorises}>
      <Routes>
        {autorises.map((m) => <Route key={m.chemin} path={m.chemin} element={m.el} />)}
        <Route path="/ecoles/:id" element={<EcoleDetail />} />
        <Route path="/compositions/:id/saisie" element={<SaisieNotes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
