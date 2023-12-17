import ReactGA from 'react-ga4';
ReactGA.initialize('G-7PR5M4K0RF');
const sendPageView = (pageName,label) => {
    ReactGA.send({ hitType: "pageview", page: pageName,label: label });
}
export default sendPageView;

