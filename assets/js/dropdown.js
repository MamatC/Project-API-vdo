    let genres = document.querySelectorAll('.navRight__genres');
    let drop = document.querySelector('.dropdown');
    
    //clic en dehors du bouton dropdown active la fermeture du menu
    window.addEventListener('click', function(event){
    //si la cible du clic ne correspond pas au dropdown 
        if(!event.target.matches('.navRight__genres')){
            //alors je ferme le menu de la dropdown
            drop.classList.remove('open');
        };
    });

    genres.forEach(genre=>{
        genre.addEventListener('click', function(){
        drop.classList.toggle('open');
        })
    })

    let token = '?api_key=791206cb5e9da02a43f31c8d24a4639f';
    let language = '&language=fr';
    
    fetch(`https://api.themoviedb.org/3/genre/movie/list${token}${language}`)
    .then(response=>response.json())
    .then(genres=>{
        // console.log(genres);
        let genre = genres.genres;
        // console.log(genre);
        genre.forEach(item=>{
            let genreName = item.name;
            // console.log(genreName);
            let contain = document.querySelector('.dropdown');
            contain.innerHTML += `<ul><a href="page-genre.html?${item.id}"><li>${genreName}</li></a></ul>`;
        })
    })