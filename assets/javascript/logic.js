// ref example(s) from class: GWU_Data_Bootcamp/GWAR201710FSF5-Class-Repository-FSF/06-ajax/01-Activities/14-DynamicElements

// This is the initial videogame title array.
var videoGames = ["FFVII", "Chrono Trigger", "Smash Bros", "Katamari", "God of War", "Mario", "Street Fighter", "Metroid", "Earthbound", "Zelda", "Sonic the Hedgehog", "Pikmin", "Pac-Man", "Okami", "Shadow of the Colossus", "Kingdom Hearts", "Final Fantasy VI", "SNES"];
var gameGIF = "";

// This function shows all the buttons at the top of the page.
function showButtons() {
  $("#buttonItems").empty();
  $("#game-input").val("");

  for (var i = 0; i < videoGames.length; i++) {
    var button = $("<button class='btn btn-primary'>");
    button.addClass("game");
    button.attr("game-name", videoGames[i]);
    button.text(videoGames[i]);
    $("#buttonItems").append(button);
    $("#buttonItems").append(" ");
  }
}

showButtons();

// This runs when the user clicks "Load Game!, adding the seletion to the button array and updating the buttons.
$("#addGameItem").on("click", function(event) {
  $("#entry").empty();
  event.preventDefault();
  var gameInput = $("#game-input").val().trim();
  var gameTerm = $(this).attr("game-name");

  //  Ensures the user's button has at least 10 GIFs available from GIPHY API.
  // If there aren't 10, an error message will be shown and no button will be created.
  var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + gameInput + "&limit=2&api_key=XNXXBU3B0vxwgDFnrUVQrnh1U12f5CSP";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {

    if (response.pagination.total_count >= 10) {
      videoGames.push(gameInput);
      showButtons();
    } else if (response.pagination.total_count === 0) {
      $("#entry").html(" Sorry, nothing in the GIPHY database.  Please try again!");
    } else if (response.pagination.total_count === 1) {
      $("#entry").html(" Sorry, there was only 1 result for this.  Please try again.");
    } else {
      $("#entry").html(" Sorry, there were only " + response.pagination.total_count + " results for this.  Please try again.");
    }
    $("#game-input").val("");
  });

});

$(document).on("click", ".game", display);

function display() {

  // Clears out error message (if one pops up)
  $("#entry").empty();

  var gameTerm = $(this).attr("game-name");

  // The GIPHY query.  This limits to 10 results
  var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + gameTerm + "&limit=10&api_key=XNXXBU3B0vxwgDFnrUVQrnh1U12f5CSP";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {

    // This runs 10 times (limit is 10 per above query) to show all the GIPHY pictures from the website's API response.
    for (var i = 0; i < response.data.length; i++) {

      // Gets the animated gif URL
      var active = response.data[i].images.fixed_width.url;
      // Gets the still gif URL
      var still = response.data[i].images.fixed_width_still.url;
      var rating = "Rating: " + (response.data[i].rating).toUpperCase();

      // Creates the new img item
      var gameGIF = $("<img>");

      // Changes the text color of ratings to green so can be seen against background more easily
      $("#ratings");

      // This creates a new div for the rating so that it maintains the gifs size
      var ratingDiv = $("<div id='ratingDiv'>" + rating + "</div>");

      gameGIF.attr({
        "active": active,
        "still": still,
        "src": still,
        "state": "still"
      });

      // This holds the new div for both the image itself and the associated rating. All images should have a rating on top of them.
      var ratingAndImage = $("<div class='floatLeft'>");

      $(ratingAndImage).prepend(ratingDiv, gameGIF);

      // This adds the rating and image to the page.
      $("#ratings").prepend(ratingAndImage);

      // When the user clicks on a GIF, this will either start or stop the animation of said GIF.
      $(gameGIF).on("click", function(event) {

        // Clears out any error messages, concerning query response i.e. number of results (if there are too few)
        $("#entry").empty();

        var state = $(this).attr("state");
        var source = $(this).attr("src");

        if (state === "still") {
          $(this).attr("src", $(this).attr("active"));
          $(this).attr("state", "active");
        } else {
          $(this).attr("src", $(this).attr("still"));
          $(this).attr("state", "still");
        }
      });

    }

  });

}
