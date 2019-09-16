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
