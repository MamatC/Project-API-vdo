
let id_people = window.location.search.substr(1);

vdo_api_load_people(id_people);
vdo_api_load_people_movie(id_people);

function vdo_api_load_people(id_people) {
    let token = '791206cb5e9da02a43f31c8d24a4639f';
    let language = '&language=fr';
    /*--------------------------------------------------*/
    let a = "";
    let b = "";
    // construction de l'url de la jaquette 
    let path_img = "";
    let image = "../assets/images/croix.svg";
    let url = "";
    /* URL pour traduire le tire du film */
    url = 'https://api.themoviedb.org/3/person/' + id_people;
    url = url + '?api_key=' + token + language;
    //fetch communique avec l'API par l'intermediaire de l'URL
    fetch(url)
    .then(response => response.json())
    .then(people => 
    {
        if (people.total_pages === 0) {
        document.querySelector('#info_detail_casting').innerText = "Aucune information trouvée pour cet acteur ou cette actrice";
        }
        // construction de l'url de la jaquette 
        if  (people.profile_path === null){
            path_img = image;
        }else{
            path_img = "http://image.tmdb.org/t/p/" + "w185" + people.profile_path;
        }
        let node = document.createElement('div');
        node.classList.add("profil__cadre");
        node.innerHTML = `
        <div class="profil__img">
            <img src="${path_img}" alt="${people.name}">
        </div>
        <div class="profil__text">
            <h3>${people.name}</h3>
            <p>Date de naissance : <span>${people.birthday}</span></p>
        </div>
        <div class="profil__overview">
            <p><span>${people.biography}</span></p>
        </div>
        `;

        let infos = document.querySelector('.profil');
        infos.append(node);
    })
    .catch(error => {
        //alert('Erreur:'+ error);
        document.querySelector('#info_detail_casting').innerText = "Aucune information trouvée pour cet acteur ou cette actrice";
    }); 
}

function vdo_api_load_people_movie(id_people) {
    let token = '791206cb5e9da02a43f31c8d24a4639f';
    let language = '&language=fr';
    /*--------------------------------------------------*/
    let url = "";
    /* URL pour traduire le tire du film */
    url = 'https://api.themoviedb.org/3/person/' + id_people;
    url = url + '/movie_credits?api_key=' + token + language;
    //fetch communique avec l'API par l'intermediaire de l'URL
    fetch(url)
    .then(response => response.json())
    .then(posts => 
    {
        if (posts.total_pages === 0) {
        document.querySelector('#info_filmographie').innerText = "Aucune filmographie trouvée pour cet acteur ou cette actrice";
        }
        //console.log("filmographie ", posts);
        let s = posts.cast.length;
        //console.log("s ", s)
        if (s>20){
            s=20;
        }
        let films = posts.cast;
        // construction de l'url de la jaquette 
        let path_img = "";
        let image = "../assets/images/croix.svg";
        //console.log("films ", films);
        let film = ""
        let i=0;
        while (i<s)  {
            film = films[i];
            //console.log("film ", film);
            //<p>id : <span>${film.id}</span></p>
            if  (film.poster_path === null){
                path_img = image;
            }else{
                path_img = "http://image.tmdb.org/t/p/" + "w154" + film.poster_path;
            }
            let categ = "movie";
            let node = document.createElement('div');
            node.classList.add("gridCards__cadre");
            
            node.innerHTML = `
            <a href="page-detail.html?${categ}/${film.id}">
            <div class="gridCards__cards">
                <div class="gridCards__cards--opacity">
                    <div class="gridCards__cards--opacity--title">
                        <h3>${film.title}</h3>
                        <p>Popularité : <span>${film.popularity}</span></p>
                        
                    </div>
                </div>
                <div class="gridCards__cards--jacket">
                    <img src="${path_img}" alt="image du film : ${film.title}">
                </div>   
            </div>
            </a>
            `;

            let infos = document.querySelector('.gridCards');
            infos.append(node);

            i++;
        }       

    })
    .catch(error => {
        //alert('Erreur:'+ error)
        let infos = document.querySelector('#info_filmographie');
        infos.innerText = "Aucune filmographie trouvée pour cet acteur ou cette actrice";
    }); 
}