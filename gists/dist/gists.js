var horizon = Horizon();
horizon.connect();

// Handeling the gists list.
var gistsLists = new Vue({
  el: '#gistsLists',
  data: {
    gists: []
  }
});

const gists = horizon('gists');

gists.watch({rawChanges: true}).subscribe(gists => {

  if (gists.new_val == undefined) {
    return;
  }
  gistsLists.gists.push(gists.new_val)
});
