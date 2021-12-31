/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  const url = 'https://api.tvmaze.com/search/shows'
  const showsRes = await axios.get(url, {params: {q: query}});
  const shows = showsRes.data;
  // console.log(shows);
  return shows;
  // return [ // hardcoded example show response object
  //   {
  //     id: 1767,
  //     name: "The Bletchley Circle",
  //     summary: "<p><b>The Bletchley Circle</b> follows the journey of four ordinary women with extraordinary skills that helped to end World War II.</p><p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their normal lives, modestly setting aside the part they played in producing crucial intelligence, which helped the Allies to victory and shortened the war. When Susan discovers a hidden code behind an unsolved murder she is met by skepticism from the police. She quickly realises she can only begin to crack the murders and bring the culprit to justice with her former friends.</p>",
  //     image: "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
  //   }
  // ]
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  // const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    if (show.show.image){
      let $item = $(
        `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.show.id}">
          <div class="card" data-show-id="${show.show.id}">
            <div class="card-body" data-show-id="${show.show.id}">
              <h5 class="card-title"><b>${show.show.name}</b></h5>
              <img class="card-img-top" src="${show.show.image.medium}">
              <p class="card-text">${show.show.summary}</p>
              <button class="episodes" data-show-id="${show.show.id}">See Episodes</button>
            </div>
          </div>
        </div>
        `);

    $showsList.append($item);
    // const epsBtn = document.querySelector(`button[data-show-id="${show.show.id}"]`);
    // epsBtn.addEventListener('click', async function handleEpsClick (e) {
    //   let episodes = await searchEpisodes(show.show.id);
    //   populateEpisodes(episodes);
    // })
    } else {                       //added this conditional because it would break the code if there was non image, so now it doesn't create an image if there isn't one in the response obj
      let $item = $(
        `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.show.id}">
          <div class="card" data-show-id="${show.show.id}">
            <div class="card-body" data-show-id="${show.show.id}">
              <h5 class="card-title"><b>${show.show.name}</b></h5>
              <p><em>no image available :(</em></p>
              <p class="card-text">${show.show.summary}</p>
              <button class="episodes" data-show-id="${show.show.id}">See Episodes</button>
            </div>
          </div>
        </div>
        `);

    $showsList.append($item);
    }
  }
}

const $showsList = $("#shows-list");

$showsList.on('click', async function handleEpsBtnClick(e){
  if (e.target.tagName ==='BUTTON') {
    console.log('clicked', e.target.getAttribute('data-show-id'));
    let show = e.target.getAttribute('data-show-id');
    let epsArr = await searchEpisodes(e.target.getAttribute('data-show-id'));
    console.log(epsArr);
    populateEpisodes(epsArr, show)
  }
})


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function searchEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  const epsRes = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  const eps = epsRes.data;
  // console.log(eps);
  return eps;
  // TODO: return array-of-episode-info, as described in docstring above
}

async function populateEpisodes(eps, id) {
  const $selectedCardBody = $(`div.card-body[data-show-id="${id}"]`);
  const $epsList = $(`<ul></ul>`);
  $selectedCardBody.append($epsList)
  for (let i=0; i<eps.length; i++) {
    console.log(eps[i].name)
    let $epLI = $(
      `<li><em>${eps[i].name}</em></li>`
    )
    $epsList.append($epLI);
  }
}