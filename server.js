console.log('Hier komt je server voor Sprint 10. Gebruik uit Sprint 9 alleen de code die je mee wilt nemen.')

console.log('Hier komt je server')

// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'))

// Zorg dat werken met request data makkelijker wordt
app.use(express.urlencoded({extended: true}))


// TODO: routes voor de amsterdam buurt initiatieven

// Homepage 
app.get('/', function(request, response) {
	fetchJson('https://fdnd-agency.directus.app/items/dh_services').then((servicesDataUitDeAPI) => {
		response.render('homepage', {services: servicesDataUitDeAPI.data})
	});
})
// Contact pagina 
app.get('/contact', function(request, response) {
	response.render('contact')
})
// About pagina 
app.get('/about', function(request, response) {
	response.render('about')
})
// FAQ pagina 
app.get('/faq', function(request, response) {
	response.render('faq')
})


// Vraag en aanbod pagina 
app.get('/vraag-aanbod', function(request, response) {

	fetchJson('https://fdnd-agency.directus.app/items/dh_services').then((servicesDataUitDeAPI) => {
		response.render('vraag-aanbod', {services: servicesDataUitDeAPI.data})
	});
	
})

// Vraag en aanbod detail(id) pagina 
app.get('/vraag-aanbod/:serviceId', function(request, response) {
	fetchJson('https://fdnd-agency.directus.app/items/dh_services?filter={"id":' + request.params.serviceId + '}').then((serviceDetail) => {
		response.render('service', {service: serviceDetail.data[0]})
	})
})

// Opdracht aanmelden pagina
// Weet nog niet welke api ik in moet laden > hier nog naar kijken
app.get('/opdracht-aanmelden', function(request, response) {

	fetchJson('https://fdnd-agency.directus.app/items/dh_services').then((servicesDataUitDeAPI) => {
		response.render('opdracht-aanmelden', {services: servicesDataUitDeAPI.data})
	});
	
})

// De formulier pagina van de opdracht aanmelden
app.get('/opdracht-aanmelden/formulier', function(request, response) {

	fetchJson('https://fdnd-agency.directus.app/items/dh_services').then((servicesDataUitDeAPI) => {
		response.render('formulier', {services: servicesDataUitDeAPI.data})
	});
	
})


// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function() {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})