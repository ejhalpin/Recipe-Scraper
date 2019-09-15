$(document).on("click", ".save-recipe", function() {
  var id = $(this).attr("data-id");
  $.get("/save/" + id, function(response) {
    $("#" + id).remove();
    console.log(response);
  });
});

$(document).on("click", "#scrape-recipes", function() {
  $("#loading-modal").modal("show");
  $.get("/scrape", function(res) {
    location.href = "/";
  });
});

$(document).on("click", "#clear-recipes", function() {
  var model = location.href.includes("saved") ? "saved" : "recipes";
  console.log(model);
  $.get("/clear/" + model, function(res) {
    if (res.err) {
      console.log(res);
      return;
    }
    location.reload(true);
  });
});

$(document).on("click", ".delete-recipe", function() {
  var id = $(this).attr("data-id");
  $.get("/delete/" + id, function(err) {
    if (err) {
      console.log(err);
    }
    $("#" + id).remove();
    location.reload(true);
  });
});

$(document).on("click", "#show-notes", function() {});
