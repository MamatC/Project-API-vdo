
window.onload = function() {

    let param_genre = window.location.search.substr(1);
    let param_page = 1;

        /*on crée la barre de catégories et on active */
        /*par défaut la catégorie :  films */
        category();
        //on pose l'écouteur d'évènements sur les catégories
        ecoute_category()
        /* on charge par défaut : les films */
        vdo_api_load_genre(param_genre, "movie", param_page);
}

function vdo_api_load_genre(param, categ, page_num) {
    let token = '791206cb5e9da02a43f31c8d24a4639f';
    let language = '&language=fr';
    /*--------------------------------------------------*/
    //https://api.themoviedb.org/3/discover/movie?api_key=<<api_key>>&language=en-US
    //&sort_by=popularity.desc&include_adult=false&include_video=false&page=1
    //&with_watch_monetization_types=flatrate
    /*--------------------------------------------------*/
    let app = "&append_to_response=images&include_image_language=fr,null"
    /*--------------------------------------------------*/
    let url = "";
    /*--------------------------------------------------*/
    url = 'https://api.themoviedb.org/3/discover/' + categ + '?api_key=' + token + language;
    url = url + '&sort_by=popularity.desc&with_genres=' + param + '&page=' + page_num + app;
    /*--------------------------------------------------*/
    /* traitement FETCH pour les films et les séries tv */
    fetch(url)
    .then(response => response.json())
    .then(posts => 
    {

        if (posts.total_pages === 0) {
            document.querySelector('#info_page_film').innerText = 'Aucun film ou série trouvé(e).';
        }
        //boucle de traitement des films
        //affichage de 20 films maximum
        //console.log("Posts : ", posts);
        let pages_total = posts.total_pages;
        //console.log("pages_total : ", pages_total);
        if (pages_total > 10){
          pages_total = 10;
        }

        /* on crée la pagination */
        pagination(page_num, pages_total);
        /* on pose les écouteurs d'évènements sur les ul */
        ecoute(page_num, pages_total);
        /* on charge la page courante */
        let page_lu = posts.page;
        /*
        if (page_lu !== page_num){
          console.log(posts)
        }
        */
        /* on limite la lecture de la page à 20 titres */
        let s = posts.results.length;
        if (s>20){
            s = 20;
        }
        let path_img = "";
        let results = "";
        let tritre_film = "";
        let image = "../assets/images/croix.svg";
        let i = 0;
        while (i<s) {
            results = posts.results[i];
            console.log("results : ", results);
            // construction de l'url de la jaquette
            if  (results.poster_path === null){
                path_img = image;
            }else{
                path_img = "http://image.tmdb.org/t/p/" + "w154" + results.poster_path;
            }
            
            /* création de la structure d'affichage du film ou de la série */
            let node = document.createElement('div');
            node.classList.add("gridCards__cadre");
            // en mode tv, le titre est : name
            // en mode movie, le titre est title
            if (categ==='movie'){
                tritre_film = results.title;
            }else{
                tritre_film = results.name;
            }
            // alert(categ);
            // pour le debug
            //<p>id : ${results.id}</p>
            node.innerHTML = `
            <a href="page-detail.html?${categ}/${results.id}">
            <div class="gridCards__cards">
                <div class="gridCards__cards--opacity">
                    <div class="gridCards__cards--opacity--title">
                    <h3>${tritre_film}</h3>
                    <p>Popularité : <span>${results.popularity}<span></p>
                    </div>
                </div>
                <div class="gridCards__cards--jacket">
                <img src="${path_img}" alt="${tritre_film}">
                </div>
            </div>
            </a>
            `;
            //console.log(node);
            let infos = document.querySelector('.gridCards');
            infos.append(node);
            i++;
            //pour arrêter la boucle à la première itération
            //i=s; 
        }
        //on place un écouteur d'évènement sur les divs : gridCards__cards

    })
    .catch(error => {
        //alert('Erreur:'+ error)
        let type = "";         
        if (categ==='movie'){
            type = "film non trouvé.";
        }else{
            type = "série tv non trouvée.";
        }
        let infos = document.querySelector('#info_page_film');
        infos.innerText = type;
    }); 
}

function category(){
    let cat = document.querySelector(".category ul");
    let li_list = "";
    let active = "active";
    li_list = li_list + `<li class="${active}" id="cat_film">FILMS</li> `;
    li_list = li_list + `<li class="" id="cat_series">SERIES</li> `;
    cat.innerHTML = li_list;
}

function ecoute_category(){
    /* on pose les écouteurs d'évènement sur les ul*/
    let elements = document.querySelectorAll(".category ul li");
    elements.forEach(element => {
       element.addEventListener("click", pagine_category);
    });
 }

 function pagine_category(){
    let b = 1; // initialisation de la pagination à 1
    let c = this.innerText; //on récupère la gatégorie
    //console.log(c);
    let f = document.querySelector('#cat_film');
    let s = document.querySelector('#cat_series');
    if  (c === "SERIES"){
        c = "tv";
        //console.log(c);
        f.classList.toggle('active');
        s.classList.toggle('active');
    }
    if  (c === "FILMS"){
        c = "movie";
        f.classList.toggle('active');
        s.classList.toggle('active');
    }
    // on nettoie la grille contenant les films ou séries affichées
    let grille = document.querySelectorAll('.gridCards div');
    grille.forEach(element => {
      element.remove();
    });
    // on nettoie les messages d'erreur eventuel
    let mess = document.querySelector('#info_page_film');
    mess.innerText=""
    // on affiche la grille
    let context = window.location.search.substr(1);

    vdo_api_load_genre(context, c, b)
};

function pagination(page_num, pages_total){
  element = document.querySelector(".pagination ul");
  let li_list = "";
  let active = "active";
  let i = 1;
  console.log("pagination ", page_num, pages_total);
  while (i <= pages_total) {
    //alert(pages_total + "  " + page_num + "  "+ i);
    if (i == page_num){
      li_list = li_list + `<li class="${active}">${i}</li> `;
      //console.log(li_list);
    }else{
      li_list = li_list + `<li class="">${i}</li> `;
    }
    i++;
  }
  element.innerHTML = li_list;
}

function ecoute(page_num, pages_total){
   /* on pose les écouteurs d'évènement sur les ul*/
   elements = document.querySelectorAll(".pagination ul li");
   elements.forEach(element => {
      element.addEventListener("click", pagine);
   });
}

function pagine(){
  let b = this.innerText;
  //console.log(b);
  // on nettoie la grille
  let grille = document.querySelectorAll('.gridCards div');
  grille.forEach(element => {
    element.remove();
  });
  // on affiche la grille
  let context = window.location.search.substr(1);

  vdo_api_load_genre(context, 'movie' , b)
};
