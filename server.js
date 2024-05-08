console.log('Hier komt je server voor Sprint 10. Gebruik uit Sprint 9 alleen de code die je mee wilt nemen.')

// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'



// Maak een nieuwe express app aan
const app = express()
const baseUrl = 'https://fdnd-agency.directus.app/'
const apiUrl = 'https://fdnd-agency.directus.app/items/dh_services'
const likes = []

// Stel ejs in als template engine
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'))

// Zorg dat werken met request data makkelijker wordt
app.use(express.urlencoded({extended: true}))


// Routes voor de amsterdam buurt initiatieven
// Homepage 
app.get('/', function(request, response) {
	fetchJson('https://fdnd-agency.directus.app/items/dh_services').then((servicesDataUitDeAPI) => {
		response.render('homepage', {
			services: servicesDataUitDeAPI.data,
			likes: likes
		})
	});
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

// About pagina 
app.get('/about', function(request, response) {
	response.render('about')
})
// FAQ pagina 
app.get('/faq', function(request, response) {
	response.render('faq')
})

// Contact pagina 
app.get('/contact', function(request, response) {
	response.render('contact')
})




// POST ROUTE VOOR DE HOMEPAGE
app.post('/', function(request, response){
	// Haal eerst de huidige gegevens voor deze service op, uit de WHOIS API
	fetchJson(`${baseUrl}items/dh_services/${request.body.id}`).then(({ data }) => {
		// Stap 2: Sla de nieuwe data op in de API
		// Voeg de nieuwe lijst likes toe in de WHOIS API, via een PATCH request
		fetch(`${baseUrl}items/dh_services/${request.body.id}`, {
		  method: 'PATCH',
		  body: JSON.stringify({
			likes: data.likes + 1,
		  }),
		  headers: {
			'Content-type': 'application/json; charset=UTF-8',
		  },
		}).then((patchResponse) => {
		  	// Redirect naar de home pagina
			if(request.body.enhanced) {
				response.render('partials/likes', {service: {likes: data.likes + 1}})
			} else {
				response.redirect(303, '/')
			}
		
		})
	  })
})



// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function() {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})