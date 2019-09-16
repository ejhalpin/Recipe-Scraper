$(document).on("click", ".save-recipe", function() {
  var id = $(this).attr("data-id");
  $.get("/save/" + id, function(res) {
    if (res.status > 299) {
      console.log(res);
      return;
    }
    $("#" + id).remove();
  });
});

$(document).on("click", "#scrape-recipes", function() {
  $("#loading-modal").modal("show");
  $.get("/scrape", function(res) {
    if (res.status > 299) {
      console.log(res);
      return;
    }
    location.href = "/";
  });
});

$(document).on("click", "#clear-recipes", function() {
  var model = location.href.includes("saved") ? "saved" : "recipes";
  $.get("/clear/" + model, function(res) {
    if (res.status > 299) {
      console.log(res);
      return;
    }
    location.reload(true);
  });
});

$(document).on("click", ".delete-recipe", function() {
  var id = $(this).attr("data-id");
  $.get("/delete/" + id, function(res) {
    if (res.status > 299) {
      console.log(res);
      return;
    }
    $("#" + id).remove();
  });
});

$(document).on("click", ".add-note", function() {
  $("#note-modal").modal("show");
});

$(document).on("click", "#save-note", function() {
  var id = location.href
    .split("/")
    .pop()
    .split("#")
    .shift();
  var body = $("#note-body")
    .val()
    .trim();
  $.post("/api/note/" + id, { body: body }, res => {
    if (res.status > 299) {
      console.log(res);
      return;
    }
    var url = location.href.split("#").shift();
    location.href = url;
  });
});

$(document).on("click", ".delete-note", function() {
  var recipeId = $(this).attr("data-recipe");
  var id = $(this).attr("data-id");
  var target = $("#note-" + id);
  $.post("/api/delete/", { recipeId: recipeId, id: id }, res => {
    if (res.status > 299) {
      console.log(res);
      return;
    }
    target.remove();
  });
});
