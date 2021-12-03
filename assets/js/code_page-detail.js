
let param = window.location.search.substr(1);
let param_long = param.length;
let param_categ ="";
let param_id = "";
if (param.substring(0, 2) ==="tv"){
    param_categ = "tv";
    param_id = param.substring(3, param_long);
}else{
    param_categ = "movie";
    param_id = param.substring(6, param_long);
}
// console.log(param);
// console.log(param_long);
// console.log(param_categ);
// console.log(param_id);


// détail du film
vdo_api_load_movie_detail(param_id, param_categ);
// casting du film
vdo_api_load_movie_casting(param_id, param_categ);

// 20 recommandations pour ce film 
vdo_api_load_movie_recommendations(param_id, param_categ);

// films similaires
//https://api.themoviedb.org/3/movie/{movie_id}/similar?api_key=<<api_key>>&language=en-US&page=1


function vdo_api_load_movie_detail(id_movie, categ){

    let token = '791206cb5e9da02a43f31c8d24a4639f';
    let language = '&language=fr';
    let image = "../assets/images/croix.svg";
    let path_img = "";
    let tritre_film = "";
    /*--------------------------------------------------*/
    let app = "&append_to_response=images&include_image_language=fr,null"
    /*--------------------------------------------------*/
    /* URL pour le détail du film */
    url = 'https://api.themoviedb.org/3/'+ categ + '/' + id_movie;
    url = url + '?api_key=' + token + language;
    //fetch communique avec l'API par l'intermediaire de l'URL
    fetch(url)
    .then(response => response.json())
    .then(post => 
        {
        if (post.total_pages === 0) {
            document.querySelector('#info_detail').innerText = 'Aucun détail trouvé pour ce film ou cette série';
        }
        //console.log("post : ", post);
        /* récupération des images */
        // construction de l'url de la jaquette 
        if  (post.poster_path === null){
            path_img = image;
        }else{
            path_img = "http://image.tmdb.org/t/p/" + "w185" + post.poster_path;
        }
        let vote_moyen = post.vote_average;
        // construction de l'ul Productions
        let p = post.production_countries;
        let productions = '<ul>Productions :';
        let m = p.length;
        for (i=0; i < m;  i++) {
            productions = productions + '<li>' + p[i].name + "</li>";
        }
        productions = productions + '</ul>';
        // construction de l'ul Genres
        let g = post.genres;
        let genres = '<ul>Genres :';
        m = g.length;
        for (i=0; i < m;  i++) {
            genres = genres + `<li><a href="page-genre.html?${g[i].id}">` + g[i].name + "</a></li>";
        }
        genres = genres + '</ul>';
        /* -------------------------------------------------*/
        //<p><span>${post.overview}</span></p>
        /* -------------------------------------------------*/
        if (categ==='movie'){
            tritre_film = post.title;
        }else{
            tritre_film = post.name;
        }
        let node = document.createElement('div');
        node.classList.add("detail__cadre");
        node.innerHTML = `
        <div class="detail__img">
            <img src="${path_img}" alt="image du film ${tritre_film}">
        </div>
        <div class="detail__text">
            <h3>${tritre_film}</h3>
            <p>Année de sortie : <span>${post.release_date}</span></p>
            <p>Langue originale : <span>${post.original_language}</span></p>
            <p>Vote moyen : <span>${vote_moyen}</span></p>
        </div>
        <div class="detail__overview">
            <p><span>${post.overview}</span></p>
        </div>
        <div class="detail__genre">${genres}</div>
        <div class="detail__prod">${productions}</div>
        `;

        let infos = document.querySelector('.detail');
        infos.append(node);

    })
    .catch(error => {
        //alert('Erreur:'+ error)
        document.querySelector('#info_detail').innerText = 'Aucun détail trouvé pour ce film ou cette série';
    });
}


function vdo_api_load_movie_casting(id_movie, categ){
    let token = '791206cb5e9da02a43f31c8d24a4639f';
    let language = '&language=en-FR';
        /* URL pour le détail du film */
    let url = 'https://api.themoviedb.org/3/'+categ+'/' + id_movie;
    url = url + '/credits?api_key=' + token + language;
 
    //fetch communique avec l'API par l'intermediaire de l'URL
    fetch(url)
    .then(response => response.json())
    .then(casting => 
        {
        if (casting.total_pages === 0) {
            document.querySelector('#info_casting').innerText = 'Aucun casting trouvé pour ce film ou cette série';
        }
        //console.log("casting ", casting);
        let r = casting.cast.length;
        //console.log("r ", r);
        if (r>20){
            r=20;
        }
        let cast ="";
        let infos = document.querySelector('.casting');
        // construction de l'url de la jaquette 
        let path_img = "";
        let image = "../assets/images/croix.svg";
        //tant qu'il y a des films recommandés, on crée des divs pour alimenter
        //la grille des films recommandés
        for (i=0; i<r; i++){
            cast = casting.cast[i];
            //console.log("cast ", cast);
            /* image du profile */
            if  (cast.profile_path === null){
                path_img = image;
            }else{
                path_img = "http://image.tmdb.org/t/p/" + "w185" + cast.profile_path;
            }
            //<p>id : <span>${cast.id}</span></p>
            //création de la div recevant les éléments concernant le film recommandé
            let node = document.createElement('div');
            node.classList.add("casting__cadre");
            node.innerHTML = `
            <a href="page-detail-casting.html?${cast.id}">
            <div class="casting__img">
                <img src="${path_img}" alt="${cast.name}" class="w45">
            </div>
            <div class="casting__text">
                <h3>${cast.name}</h3>
                <p>Popularité : <span>${cast.popularity}</span></p>
                <p>Rôle : <span>${cast.character}</span></p>
            </div>
            </a>
            `;
            infos.append(node);
        }            
            
        })
    .catch(error => {
        //alert('Erreur:'+ error)
        document.querySelector('#info_casting').innerText = 'Aucun casting trouvé pour ce film ou cette série';
        });
}



function vdo_api_load_movie_recommendations(id_movie, categ){
    //variables
    let page_num = 1;
    
    /*--------------------------------------------------*/
    // affiche l'image du film en français
    let app = "&append_to_response=images&include_image_language=fr,null";
    /*--------------------------------------------------*/
    // affiche le ttire du film en français
    //https://api.themoviedb.org/3/movie/{movie_id}/translations?api_key=<<api_key>>
    //let appFR = "&append_to_response=" + categ + "/" + id_movie + "/translations?api_key=" + token + language;
    /*--------------------------------------------------*/
    let token = '791206cb5e9da02a43f31c8d24a4639f';
    let language = '&language=en-FR';
    /* URL pour le détail du film */
    let url = 'https://api.themoviedb.org/3/' + categ + "/" + id_movie;
    url = url + '/recommendations?api_key=' + token + language;
    url = url + "&page=" + page_num;
     /*--------------------------------------------------*/
    //fetch communique avec l'API par l'intermediaire de l'URL
    fetch(url)
    .then(response => response.json())
    .then(post => 
        {
        //console.log(post);
        if (post.total_pages === 0) {
            document.querySelector('#info_recommandations').innerText = 'Aucune recommandation trouvée pour ce film ou cette série';
        }
        //console.log("recommandations ", post);
        let r = post.results.length;
        if (r>20){
            r=20;
        }
        let results ="";
        let infos = document.querySelector('.gridCards');
        // construction de l'url de la jaquette 
        let path_img = "";
        //tant qu'il y a des films recommandés, on crée des divs pour alimenter
        //la grille des films recommandés
        for (i=0; i<r; i++){
            results = post.results[i];
            //console.log("results ", results);
            //console.log("recommendations ", results);
            //console.log("titre ", results.original_title);
            /* image de fond */
            path_img = "http://image.tmdb.org/t/p/" + "w154";
            path_img = path_img + results.poster_path;
            //création de la div recevant les éléments concernant 
            //le film ou la série recommandé(e)
            let node = document.createElement('div');
            node.classList.add("gridCards__cadre");
            // en mode tv, le titre est : name
            // en mode movie, le titre est title
            //console.log(results);
            let titre_film = "";
            if (categ==='movie'){
                titre_film = results.title;
            }else{
                titre_film = results.name;
            }
            // pour le debug
            //<p>id : <span>${results.id}</span></p>
            node.innerHTML = `
            <a href="page-detail.html?${categ}/${results.id}" id="${results.id}">
            <div class="gridCards__cards">
                <div class="gridCards__cards--opacity">
                    <div class="gridCards__cards--opacity--title">
                        <h3>${titre_film}</h3>
                        <p>Popularité : <span>${results.popularity}</span></p>
                    </div>
                </div>               
                <div class="gridCards__cards--jacket">
                    <img src="${path_img}" alt="${titre_film}">
                </div>
            </div>
            `;
            infos.append(node);
            // pour le debug
            //i=r;
        }
    })
    .catch(error => {
        //alert('Erreur:'+ error);
        //console.log(error);
        document.querySelector('#info_recommandations').innerText = 'Aucune recommandation trouvée pour ce film ou cette série';
    });
}
