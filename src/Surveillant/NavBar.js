import { Link } from "react-router-dom";
import { BiHome, BiClipboard, BiTime, BiErrorCircle, BiCalendar, BiBell, BiLogOut } from "react-icons/bi"; // Import necessary icons

const styles = {
  sidebar: {
    width: '250px',
    height: '100vh', // Full screen height
    backgroundColor: '#9b59b6',  // Purple theme
    color: 'white',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflowY: 'auto', // Enables vertical scrolling
  },
  title: {
    fontSize: '24px',
    marginBottom: '30px',
    fontWeight: 'bold',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    margin: '15px 0',
    fontSize: '18px',
  },
  link: {
    textDecoration: 'none',
    color: 'white',
    marginLeft: '10px',
  },
  button: {
    backgroundColor: '#fff',
    color: '#6a0dad',
    border: 'none',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
    width: '100%',
  }
};

export default function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title}>Bonjour Surveillant</h2>
      <ul style={styles.list}>
        <li style={styles.listItem}>
          <BiHome size={20} />
          <Link to="" style={styles.link}>Accueil</Link>
        </li>
        <li style={styles.listItem}>
          <BiClipboard size={20} />
          <Link to="absence" style={styles.link}>Absences</Link>
        </li>
        <li style={styles.listItem}>
          <BiTime size={20} />
          <Link to="retard" style={styles.link}>Retards</Link>
        </li>
        <li style={styles.listItem}>
          <BiErrorCircle size={20} />
          <Link to="incident" style={styles.link}>Incidents</Link>
        </li>
        <li style={styles.listItem}>
          <BiCalendar size={20} />
          <Link to="emploi" style={styles.link}>Emploi</Link>
        </li>
        <li style={styles.listItem}>
          <BiBell size={20} />
          <Link to="notification" style={styles.link}>Notifications</Link>
        </li>
        <li style={styles.listItem}>
          {/* <BiBell size={20} /> */}
          <Link to="absenceList" style={styles.link}>Liste des absences</Link>
        </li>
        <li style={styles.listItem}>
          {/* <BiBell size={20} /> */}
          <Link to="retardList" style={styles.link}>Liste des retards</Link>
        </li>
        <li style={styles.listItem}>
          {/* <BiBell size={20} /> */}
          <Link to="incidentList" style={styles.link}>Liste des incidents</Link>
        </li>
      </ul>
      <button style={styles.button}>
        <BiLogOut size={20} />
        Déconnexion
      </button>
    </div>
  );
}
