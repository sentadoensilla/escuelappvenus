import { UserProvider } from './services/context/UserContext'
import './App.css';
import { MisRutas } from './main/routes/mainroutes';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
// eslint-disable-next-line
// import Index from './pages/login';

function App() {
/*     
	const scriptLoaded = () => {
		window.document.head.sort();
	}
const closeMenu = () =>{
		const elHtml = document.getElementsByTagName('html')
		const elGraper = document.getElementById('elgrapper')
		if(elHtml){
			elHtml[0].classList.remove('nav_open')
		}
		if(elGraper){
			elGraper.classList.remove('sidebar_minimize')			
		}
    }
 */
	return (
		<UserProvider>			
			<MisRutas />			
		</UserProvider>
	);
}

export default App;