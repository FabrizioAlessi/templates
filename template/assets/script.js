//scroll-bar dinamica
let link = document.getElementsByClassName("nav-link")
function scroll() {
    let navBar = document.getElementById("navBar");
    if (document.documentElement.scrollTop > 50) {
        navBar.classList.add("navBarBg");
        for (let item of link) {
            item.classList.add("nav-item-scroll");
        };
    } else {
        navBar.classList.remove("navBarBg")
        for (let item of link) {
            item.classList.remove("nav-item-scroll");
        };
    };
};
window.onscroll = () => { scroll() };

//------------------popolazione offerte----------------------------//
class Continente {
    constructor() {
        this.name = "";
        this.offerte = [];
    }
    inizilizzaContinente(name) {
        this.name = name;
    }
};
const continenti = [];
const continentiObj = [];
//popola continenti
let result = {}
let continentiUnico = {}
async function prova() {
    try {
        const data = await fetch('http://localhost:3000/api/hotels/?_sort=name&_order=asc');
        result = await data.json()
    } catch (error) {
        console.log(error)
    };
    console.log(result)
    popolaContinenti();
    popolaOfferte();
    filtraOfferte();

}
function popolaContinenti() {
    continentiObj.splice(0, continentiObj.length)
    result.forEach(index => {
        let continente = index.countryCode
        continenti.push(continente)
    });
    continentiUnico = continenti.filter((x, i) => continenti.indexOf(x) === i);
    continentiUnico.forEach(index => {
        const cont = new Continente
        cont.inizilizzaContinente(index)
        console.log("oggetto " + cont.name)
        continentiObj.push(cont)
    })
    console.log("continentiObj" + continentiObj)
}
//popola offerte 
function popolaOfferte() {
    result.forEach(index => {
        switch (index.countryCode) {
            case "US":
                continentiObj[0].offerte.push(index);
                break;
            case "OCEANIA":
                continentiObj[1].offerte.push(index);
                break;
            case "ASIA":
                continentiObj[2].offerte.push(index);
                break;
            case "EU":
                continentiObj[3].offerte.push(index);
                break;
        }
    })
}
function filtraOfferte() {
    const offerteDiv = document.getElementById("offerte")
    offerteDiv.innerHTML = ""
    const continente = document.getElementById("continenti").value;
    const rating = document.getElementById("ratingFilter").value;
    continentiObj.forEach(index => {
        if (continente == "tutti") {
            if (rating == "0") {
                index.offerte.forEach(index => {
                    let offerta = document.createElement("p")
                    offerta.innerHTML = `<li> <b>${index.name}</b> - rating:${index.tripAdvisorRating}, ${index.countryCode} - a partire da <strong>tot euro</strong> <button class="btn btn-outline-success buttonPage" type="button">Prenota</button> </li>`;
                    offerteDiv.appendChild(offerta)
                })
            } else {
                index.offerte.forEach(index => {
                    if (index.tripAdvisorRating >= parseInt(rating)) {
                        let offerta = document.createElement("p")
                        offerta.innerHTML = `<li> <b>${index.name}</b> - rating:${index.tripAdvisorRating}, ${index.countryCode} - a partire da <strong>tot euro</strong> <button class="btn btn-outline-success buttonPage" type="button">Prenota</button> </li>`;
                        offerteDiv.appendChild(offerta)
                    }
                })
            }
        } else {
            if (rating == "0") {
                index.offerte.forEach(index => {
                    if (continente == index.countryCode) {
                        let offerta = document.createElement("p")
                        offerta.innerHTML = `<li> <b>${index.name}</b> - rating:${index.tripAdvisorRating}, ${index.countryCode} - a partire da <strong>tot euro</strong> <button class="btn btn-outline-success buttonPage" type="button">Prenota</button> </li>`;
                        offerteDiv.appendChild(offerta)
                    }
                })
            } else {
                index.offerte.forEach(index => {
                    if (index.tripAdvisorRating >= parseInt(rating)) {
                        if (continente == index.countryCode) {
                            let offerta = document.createElement("p")
                            offerta.innerHTML = `<li> <b>${index.name}</b> - rating:${index.tripAdvisorRating}, ${index.countryCode} - a partire da <strong>tot euro</strong> <button class="btn btn-outline-success buttonPage" type="button">Prenota</button> </li>`;
                            offerteDiv.appendChild(offerta)
                        }
                    }
                })
            }
        }
    })
}
// ----------------------------------------------------------Initialize and add the map
class Agenzia {
    constructor(lat, lng, name, indirizzo, tel) {
        this.lat = 0
        this.lng = 0
        this.name = ""
        this.indirizzo = ""
        this.tel = ""
    }
    inzializzaAgenzia(lat, lng, name, indirizzo, tel) {
        this.lat = lat
        this.lng = lng
        this.name = name
        this.indirizzo = indirizzo
        this.tel = tel
    }
}
let agenzieInfo = [
    {
        lat: 41.88904796756871,
        lng: 12.503941459493063,
        title: "Agenzia Turistica Pluto",
        tel: "339000000"
    },
    {
        lat: 41.90889905116481,
        lng: 12.464122233192056,
        title: "Agenzia Turistica Paperino",
        tel: "339000001"
    },
    {
        lat: 41.90635580297195,
        lng: 12.503941459493063,
        title: "Agenzia Turistica Pippo",
        tel: "339000002"
    }
]
let agenzie = [];
let map;
async function initMap() {
    // The location of ROma
    const position = { lat: 41.90343982201054, lng: 12.496567449029007 };
    // Request needed libraries.
    //@ts-ignore
    const { Map } = await google.maps.importLibrary("maps");

    // The map, centered at Roma
    map = new Map(document.getElementById("map"), {
        zoom: 12,
        center: position,
        mapId: "DEMO_MAP_ID",
    });
    creaAgenzia();
}
//marker agenzie generatore
function getMarker(lat, lng, name) {
    let option = {
        position: new google.maps.LatLng(lat, lng),
        map: map,
        title: name
    }
    const marker = new google.maps.Marker(option);
    marker.addListener("click", (googleMapsEvent) => {
        let lat = googleMapsEvent.latLng.lat()
        const container = document.getElementById("infoAgenzia")
        container.innerHTML = "";
        let agenzia = agenzie.find(item => item.lat == lat)
        const title = document.createElement("h3")
        const indirizzo = document.createElement("p")
        const telefono = document.createElement("p")
        const button = document.createElement("button")
        title.innerHTML = agenzia.name
        telefono.innerHTML = agenzia.tel
        indirizzo.innerHTML = agenzia.indirizzo
        button.innerHTML = "Vai al sito"
        button.setAttribute("class", "btn btn-outline-success buttonPage")
        container.appendChild(title)
        container.appendChild(telefono)
        container.appendChild(indirizzo)
        container.appendChild(button)


    })
    return marker
}
initMap();

function creaAgenzia() {
    agenzieInfo.forEach(index => {
        let agenzia = new Agenzia
        const geocoder = new google.maps.Geocoder();
        let indirizzo = ""
        const pot = {
            lat: index.lat,
            lng: index.lng
        }
        //traduco le coordinate in indirizzo
        geocoder
            .geocode({ location: pot })
            .then((response) => {
                indirizzo = response.results[0].formatted_address
                agenzia.inzializzaAgenzia(index.lat, index.lng, index.title, indirizzo, index.tel)
                agenzie.push(agenzia)
                getMarker(index.lat, index.lng, index.name)
            })
    })
}
